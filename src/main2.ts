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
    LoessTableRowType,
    GaussTableRowType,
    LocalMinTableRowType
} from './table/tableRowType.js'
import { getNameFromKey, printMemory, zeroPad } from './common.js'

class Runner {
    data: Map<string, Row[]>
    table: Table = new Table(
        [
            new StaticTableRowType('Date'), // 0
            new StaticTableRowType('Cumulative Cases'), // 1
            new AutoIncrementTableRowType('Day'), // 2
            new DiffTableRowType('Daily Cases', 1), // 3
            new AvgNTableRowType('Cases (7d AVG)', 3, 7), // 4
            new GaussTableRowType('Cases (7d AVG, smooth)', 4, 100), // 5
            new LocalMinTableRowType('Minima', 5) // 6
        ]
    )

    async loadData(): Promise<void> {
        console.log('Loading dataset...')
        const dataLoader = new DataLoader()
        this.data = await dataLoader.loadData('./data/world.csv')
        console.log('Dataset loaded.')
    }

    async processData(): Promise<void> {
        console.log('Processing data...')
        const jurisdiction = 'united_states'

        const chart = new TwitterChart(
            `COVID-19 Cases [${getNameFromKey(jurisdiction)}]`,
            'Source: OWID; Created by @USMortality',
            'Day',
            'COVID-19 Cases',
            0
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
                color: [200, 0, 0, 0.67]
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
                label: 'Minima',
                color: [0, 0, 0, 1],
            },
        ]

        for (const row of this.data.get(jurisdiction)) {
            console.log(`Processing ${row.date}`)
            this.table.insertRow([row.date, row.cases])

            chart.data = JSON.parse(JSON.stringify(chartConfig))
            chart.data[0].data = this.table.data[0]
            chart.data[1].data = this.table.data[5]
            chart.data[2].data = this.table.data[4]
            chart.data[3].data = this.table.data[3]
            chart.data[4].data = this.table.data[6]

            const lastT = this.table.data[2][this.table.data[2].length - 1]
            await chart.save(`./out/test/${jurisdiction}/${zeroPad(lastT, 3)}.png`)
            // printMemory()
        }
        console.log('Processing data finished.')
    }

    async run(): Promise<void> {
        await this.loadData()
        await this.processData()
    }
}

const runner = new Runner()
runner.run()