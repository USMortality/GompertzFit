import { AvgNTableFunction } from './../src/table/avgNTableFunction'
import { Table } from '../src/table/table'
import {
    TwitterChart,
    TwitterChartSeries,
    TwitterChartSeriesAxisType,
    TwitterChartSeriesConfigType
} from './../src/twitterChart'
import { expect } from 'chai'
import 'jest'
import looksSame from 'looks-same'
import { AvgNTableRowType, StaticTableRowType } from '../src/table/tableRowType'

describe('TwitterChart', () => {
    it('create chart', async () => {
        const table = new Table([
            new StaticTableRowType('Date'),
            new StaticTableRowType('Cases'),
            new AvgNTableRowType('Cases (Avg 7)', 1, 7)
        ])
        const rows = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
            [70, 30, 78, 81, 66, 43, 31, 48, 93, 56, 91, 25, 19, 17]
        ]
        table.insertRows(rows)
        // console.log(table.data)

        const chartData: TwitterChartSeries[] = []
        chartData.push(
            {
                axis: TwitterChartSeriesAxisType.x,
                type: TwitterChartSeriesConfigType.dot,
                label: table.columnTitles[0],
                color: [0, 0, 0],
                data: table.data[0]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.dot,
                label: table.columnTitles[1],
                color: [0, 0, 200],
                data: table.data[1]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.line,
                label: table.columnTitles[2],
                color: [0, 0, 0],
                data: table.data[2]
            }
        )

        const twitterchart = new TwitterChart('Title', 'Subtitle', 'X-axis', 'Y-axis', chartData)
        await twitterchart.save('./test/out/test.png')
        looksSame('./test/out/expected.png', './test/out/test.png',
            (_, { equal }) => {
                expect(equal).to.equal(true)
            })
    })
})