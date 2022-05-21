
import { ChartConfig, makeChart, makeLines } from './chart.js'
import { Series, Row } from './series.js'
import { Gompertz } from './gompertz.js'
import {
    fillerArray, getNameFromKey, loadJson, loadSlices, saveImage
} from './common.js'
import { Slice } from './slice.js'
import { JobClient, JobConfig } from './jobClient.js'
import { DataLoader } from './dataLoader.js'

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
    const jobClient: JobClient = await new JobClient()
    let jobConfig: JobConfig | undefined = await jobClient.getJob()
    const dataLoader = new DataLoader()

    while (jobConfig) {
        console.log(`Processing job: ${JSON.stringify(jobConfig)}`)
        const rows = await dataLoader.getRows(jobConfig.dataset)
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
            await jobClient.getJob() : undefined
    }

    await jobClient.tearDown()
}

main()
