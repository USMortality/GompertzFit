import { LocalExtramaType } from './table/localExtremaTableFunction.js'
import {
    TwitterChart,
    TwitterChartSeriesAxisType,
    TwitterChartSeriesConfigType
} from './twitterChart.js'
import { DataLoader, Row } from './dataLoader.js'
import { Table } from './table/table.js'
import {
    AutoIncrementTableRowType,
    AvgNTableRowType,
    DiffTableRowType,
    StaticTableRowType,
    GaussTableRowType,
    LocalExtremaTableRowType
} from './table/tableRowType.js'
import {
    dateString,
    fillerDateArray,
    getNameFromKey,
    zeroPad
} from './common.js'

class Runner {
    jurisdiction = 'united_states'
    data: Map<string, Row[]>
    table: Table = new Table(
        [
            new StaticTableRowType('Date'), // 0
            new StaticTableRowType('Cumulative Cases'), // 1
            new AutoIncrementTableRowType('Day'), // 2
            new DiffTableRowType('Daily Cases', 1), // 3
            new AvgNTableRowType('Cases (7d AVG)', 3, 7), // 4
            new GaussTableRowType('Cases (7d AVG, smooth)', 4, 100), // 5
            new LocalExtremaTableRowType('Min', 5, LocalExtramaType.MIN), // 6
            new LocalExtremaTableRowType('Max', 5, LocalExtramaType.MAX) // 7
        ]
    )
    sliceTable: Table = new Table([
        new StaticTableRowType('Date'), // 0
        new StaticTableRowType('Cases (7d AVG)'), // 1
    ])

    async loadData(): Promise<void> {
        console.log('Loading dataset...')
        const dataLoader = new DataLoader()
        this.data = await dataLoader.loadData('./data/world.csv')
        console.log('Dataset loaded.')
    }

    async makeOverviewChart(): Promise<void> {
        const chart = new TwitterChart(
            `COVID-19 Cases [${getNameFromKey(this.jurisdiction)}]`,
            'Source: OWID; Created by @USMortality',
            'Day',
            'COVID-19 Cases'
        )
        const chartConfig = [
            {
                axis: TwitterChartSeriesAxisType.x,
                type: TwitterChartSeriesConfigType.dot,
                label: this.table.columnTitles[0],
                color: [0, 0, 0, 1]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.line,
                label: this.table.columnTitles[5],
                color: [0, 0, 0, 1]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.line,
                label: this.table.columnTitles[4],
                color: [0, 200, 0, 0.67]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.dot,
                label: this.table.columnTitles[3],
                color: [0, 0, 255, 0.33]
            },
            {
                axis: TwitterChartSeriesAxisType.x,
                type: TwitterChartSeriesConfigType.label,
                label: (rowIndex: number): string[] => {
                    return ['Minimum', dateString(this.table.data[0][rowIndex])]
                },
                color: [0, 0, 255, 1],
            },
            {
                axis: TwitterChartSeriesAxisType.x,
                type: TwitterChartSeriesConfigType.label,
                label: (rowIndex: number): string[] => {
                    return ['Maximum', dateString(this.table.data[0][rowIndex])]
                },
                color: [255, 0, 0, 1],
            },
        ]

        for (const row of this.data.get(this.jurisdiction)) {
            console.log(`Processing ${row.date}`)
            this.table.insertRow([row.date, row.cases])

            chart.data = chartConfig
            chart.data[0].data = this.table.data[0]
            chart.data[1].data = this.table.data[5]
            chart.data[2].data = this.table.data[4]
            chart.data[3].data = this.table.data[3]
            chart.data[4].data = this.table.data[6]
            chart.data[5].data = this.table.data[7]

            const lastT = this.table.data[2][this.table.data[2].length - 1]
            await chart.save(`./out/test/${this.jurisdiction}/${zeroPad(lastT, 3)}.png`)
        }
    }

    async makeSliceChart(sliceIndex: number, slice: any[][]): Promise<void> {
        const chart = new TwitterChart(
            `COVID-19 Cases - Latest Wave [${getNameFromKey(this.jurisdiction)}]`,
            'Source: OWID; Created by @USMortality',
            'Day',
            'COVID-19 Cases'
        )
        const chartConfig = [
            {
                axis: TwitterChartSeriesAxisType.x,
                type: TwitterChartSeriesConfigType.dot,
                label: this.table.columnTitles[0],
                color: [0, 0, 0, 1]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.line,
                label: this.table.columnTitles[5],
                color: [0, 0, 0, 1]
            },
        ]

        const date = fillerDateArray(slice[0][slice[0].length - 1], 120)
        this.sliceTable.insertRows([date, slice[4]])

        chart.data = chartConfig
        chart.data[0].data = this.sliceTable.data[0]
        chart.data[1].data = this.sliceTable.data[1]

        await chart.save(`./out/test/${this.jurisdiction}/_latest.png`)
    }

    async processData(): Promise<void> {
        console.log('Processing data...')

        await this.makeOverviewChart()

        // Latest outbreak
        const sliceData = this.table.splitAt(6, 1)
        const sliceIndex = sliceData.length - 1
        const lastSlice = sliceData[sliceIndex]
        await this.makeSliceChart(sliceIndex, lastSlice)

        console.log('Processing data finished.')
    }

    async run(): Promise<void> {
        await this.loadData()
        await this.processData()
    }
}

const runner = new Runner()
runner.run()