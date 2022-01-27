import { createClient } from 'redis'

import { ChartConfig, makeChart, makeLines } from './chart.js'
import { Series, Row } from './series.js'
import { Gompertz } from './gompertz.js'
import { fillerArray, getNameFromKey, loadData, loadJson, loadSlices, saveImage } from './common.js'
import { Slice } from './slice.js'

const ADDITIONAL_DAYS = 90
const Y_SCALE_FACTOR = 2

async function getImage(
    jurisdiction: string,
    slice: Slice,
    series: Series,
    day: number,
    gompertz: Gompertz
): Promise<Buffer> {
    gompertz.end = day
    let gompertzFit = gompertz.fit(slice)
    gompertzFit = fillerArray(slice.start).concat(gompertzFit)

    const lines = makeLines(
        series.slices,
        slice.start + gompertz.end,
        series.getDate(slice.start + day)
    )
    const chartConfig: ChartConfig = {
        yMax: series.findYMax(),
        lines,
        additionalDays: ADDITIONAL_DAYS
    }
    return await makeChart(
        series, getNameFromKey(jurisdiction), chartConfig, gompertzFit
    )
}

type JobConfig = {
    folder: string,
    dataset: string,
    jurisdiction: string,
    sliceIndex: number,
    day: number,
    runType: string
}

async function getJobConfig(client: any): Promise<JobConfig | undefined> {
    return new Promise(async (resolve) => {
        let config: JobConfig
        const configJson = await client.rPop('jobs')
        if (!process.argv[2]) { // Automatic
            if (configJson === 'null') return undefined
            config = JSON.parse(configJson)
        } else { // Manual
            config = {
                folder: process.argv[2],
                dataset: process.argv[3],
                jurisdiction: process.argv[4],
                sliceIndex: parseInt(process.argv[5], 10),
                day: parseInt(process.argv[6], 10),
                runType: 'manual'
            }
        }
        resolve(config)
    })
}

const datasetCache: Map<string, Map<string, Row[]>> = new Map()
async function getRows(dataset: string): Promise<Map<string, Row[]>> {
    let result: Map<string, Row[]> = datasetCache.get(dataset)
    if (!result) {
        result = await loadData(dataset)
        datasetCache[dataset] = result
    }
    return result
}

const sliceCache: Map<string, Slice[]> = new Map()
async function getSlices(folder: string, jurisdiction: string):
    Promise<Slice[]> {
    const key = `${folder}_${jurisdiction}`
    let result: Slice[] = sliceCache.get(key)
    if (!result) {
        result = await loadSlices(folder, jurisdiction)
        sliceCache[key] = result
    }
    return result
}

async function main(): Promise<void> {
    const CONFIG: object = await loadJson('config.json')

    const client = createClient()
    await client.connect()

    let jobConfig: JobConfig | undefined = await getJobConfig(client)
    while (jobConfig) {
        console.log(`Processing job: ${JSON.stringify(jobConfig)}`)
        const rows = await getRows(jobConfig.dataset)
        const slices: Slice[] = await getSlices(
            jobConfig.folder, jobConfig.jurisdiction
        )
        const slice = slices[jobConfig.sliceIndex]

        const data: Row[] | undefined = rows.get(jobConfig.jurisdiction)
        if (!data) throw new Error(
            `Failed to load data for jurisdiction: ${jobConfig.jurisdiction}.`
        )

        const series: Series = new Series(
            CONFIG, jobConfig.folder, jobConfig.jurisdiction
        )
        series.loadData(data)
        series.startPosition = slice.start
        series.endPosition = slice.end
        series.slices = slices
        const sliceLength = slice.end - slice.start + 1

        if (sliceLength < 7) {
            try {
                series.analyze()
            } catch (e) {
                console.log(jobConfig)
            }
        }
        else series.findMinSmoothFactorAndAnalyze(slice)

        const gompertz = new Gompertz(series, ADDITIONAL_DAYS)
        const fileNumber = String(jobConfig.day).padStart(3, '0')
        const image = await getImage(
            jobConfig.jurisdiction, slice, series, jobConfig.day, gompertz
        )
        const filename = `./out/${jobConfig.folder}/${jobConfig.jurisdiction}/${jobConfig.sliceIndex}_${fileNumber}.png`
        await saveImage(image, filename)

        jobConfig = jobConfig.runType === 'auto' ?
            await getJobConfig(client) : undefined
    }

    await client.quit()
}

main()
