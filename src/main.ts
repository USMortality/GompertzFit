import { exec, execSync } from 'child_process'
import * as events from 'events'
import { createClient } from 'redis'
type RedisClientType = ReturnType<typeof createClient>
import { mkdir, writeFile } from 'fs'
import { promisify } from 'node:util'
import * as os from 'os'
import ProgressBar from 'progress'

import { loadData, saveImage, getNameFromKey, loadJson } from './common.js'
import { Slice } from './slice.js'
import { Series, Row } from './series.js'
import { ChartConfig, makeChart, makeLines } from './chart.js'
import { Command } from 'commander';

const ADDITIONAL_DAYS = 90
const MAX_IMAGES = 1
const LAST_SLICE_ONLY = true
const N_PROCESS = Math.max(1, os.cpus().length - 1)

const program = new Command();
const myEmitter = new events.EventEmitter()

async function scheduleWorkersForSlice(
    client: RedisClientType,
    folder: string,
    dataset: string,
    jurisdiction: string,
    slice: Slice,
    sliceIndex: number
): Promise<void> {
    // console.log(`Processing slice ${jurisdiction}/${sliceIndex}`)
    return new Promise(async (resolve) => {
        // Push Jobs into queue
        const config = {
            folder, dataset, sliceIndex, jurisdiction, day: undefined,
            runType: 'auto'
        }
        for (let i = slice.start; i <= slice.end; i++) {
            const jobIndex = i - slice.start
            config.day = jobIndex
            await client.lPush('jobs', JSON.stringify(config))
        }
        resolve()
    })
}

async function analyzeSeries(
    CONFIG: object,
    folder: string,
    jurisdiction: string,
    data: Map<string, Row[]>
): Promise<Slice[]> {
    const rows = data.get(jurisdiction)
    const series: Series = new Series(CONFIG, folder, jurisdiction)
    series.loadData(rows)
    series.analyze()
    series.analyzeSlices()

    const lines: object[] = makeLines(series.slices)
    const chartConfig: ChartConfig = {
        yMax: series.findYMax(),
        lines,
        additionalDays: ADDITIONAL_DAYS
    }
    const image = await makeChart(
        series, getNameFromKey(jurisdiction), chartConfig
    )

    // Create folder
    const mkdirAsync = promisify(mkdir)
    await mkdirAsync(`./out/${folder}`, { recursive: true })
    await mkdirAsync(`./out/${folder}/${jurisdiction}`, { recursive: true })

    // Make 30 images to create a longer impression to start with.
    for (let i = 0; i < MAX_IMAGES; i++) await saveImage(image, `./out/${folder}/${jurisdiction}/0_${i}.png`)

    await writeFile(`./out/${folder}/${jurisdiction}/slices.json`,
        JSON.stringify(
            series.slices.map((obj) => {
                return {
                    start: obj.start,
                    end: obj.end,
                }
            }),
            null, 2
        ),
        err => { if (err) console.log(err) }
    )

    return series.slices
}

async function startWorkers(client: RedisClientType): Promise<void> {
    return new Promise(async (resolve) => {
        let finishedProcesses = 0
        const jobs: number = await client.lLen('jobs')

        const bar = getProgressbar('Processing jurisdictions', jobs)
        for (let i = 0; i < N_PROCESS; i++) {
            const sliceWorker = exec(
                `node ./dist/src/worker.js`, (error, stdout) => {
                    if (error) console.log(error)
                    // console.log(stdout)
                })
            sliceWorker.on('exit', _ => myEmitter.emit('finished'))
            sliceWorker.stderr.on('data', (data) => {
                if (data) console.log(`stderr: ${data}`)
            })
            sliceWorker.stdout.on('data', (data) => {
                bar.tick(1)
                // console.log(`stdout: ${data}`)
            })
        }

        myEmitter.on('finished', () => {
            finishedProcesses++
            if (finishedProcesses === N_PROCESS) {
                console.log('All workers finished processing slice.')
                resolve()
            }
        })
    })
}

async function processJurisdiction(
    CONFIG: object,
    client: RedisClientType,
    folder: string,
    dataset: string,
    rows: Map<string, Row[]>,
    jurisdiction: string
): Promise<void> {
    return new Promise(async (resolve) => {
        const slices = await analyzeSeries(CONFIG, folder, jurisdiction, rows)

        // Process slices
        const startIndex = LAST_SLICE_ONLY ? slices.length - 1 : 0
        for (let i = startIndex; i < slices.length; i++) {
            const slice = slices[i]
            await scheduleWorkersForSlice(
                client, folder, dataset, jurisdiction, slice, i
            )
        }

        resolve()
    })
}

function getProgressbar(title: string, total: number): ProgressBar {
    return new ProgressBar(`${title} [:bar] :current/:total :percent :etas`, {
        complete: '=',
        incomplete: ' ',
        width: 40,
        total
    })
}

async function processJurisdictions(
    CONFIG: any, client: RedisClientType, folder: string, dataset: string,
    jurisdictionFilters: string[]
): Promise<void> {
    return new Promise(async (resolve) => {
        const rows: Map<string, Row[]> = await loadData(dataset)
        const barSize = (jurisdictionFilters ? jurisdictionFilters.length :
            undefined) || rows.size
        let bar = getProgressbar('Analyzing jurisdictions', barSize)
        for (const [jurisdiction, _data] of rows) {
            if (!jurisdictionFilters ||
                jurisdictionFilters.indexOf(jurisdiction) > -1) {
                await processJurisdiction(
                    CONFIG, client, folder, dataset, rows, jurisdiction
                )
                bar.tick(1)
            }
        }
        if (CONFIG.options.analyzeOnly) { resolve(); return }

        await startWorkers(client)
        bar = getProgressbar('Making videos', barSize)
        for await (const [jurisdiction, _data] of rows) {
            if (!jurisdictionFilters ||
                jurisdictionFilters.indexOf(jurisdiction) > -1) {
                const movie = `./out/${folder}/${jurisdiction}.mp4`
                execSync(`rm -rf ${movie}`)
                execSync(`ffmpeg -hide_banner -loglevel error -r 30 -pattern_type glob -i './out/${folder}/${jurisdiction}/*.png' -c:v libx264 -vf "fps=30,format=yuv420p,scale=1200x670" ${movie}`)
                bar.tick(1)
            }
        }
        console.log('All workers finshed!')
        resolve()
    })
}

async function main(): Promise<void> {
    const CONFIG: any = await loadJson('config.json')
    program
        .option('-d, --dataset <type>', 'choose dataset ["us", "world"]')
        .option('-f, --filters <type>', 'filter by jurisdiction ["germany", "united_states"]')
        .option('-a, --analyze-only', 'only analyze slices')
    program.parse(process.argv);
    CONFIG['options'] = program.opts();

    console.log(`Running multithreaded on ${N_PROCESS} cores!`)

    const jurisdictionFilters: string[] = CONFIG.options.filters
    console.log(`Filter: ${CONFIG.options.dataset}, ${jurisdictionFilters}`)

    // Start redis
    const client: RedisClientType = createClient()
    await client.connect()
    await client.del('jobs')

    if (!CONFIG.options.dataset || CONFIG.options.dataset === 'us') {
        console.log('Processing US states...')
        await processJurisdictions(CONFIG, client, 'us', './data/us.csv',
            jurisdictionFilters)
    }
    if (!CONFIG.options.dataset || CONFIG.options.dataset === 'world') {
        console.log('Processing countries...')
        await processJurisdictions(CONFIG, client, 'world', './data/world.csv',
            jurisdictionFilters)
    }

    // Stop redis
    await client.quit()
    console.log('Done.')
}

main()