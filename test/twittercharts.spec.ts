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
import {
    AvgNTableRowType,
    DateTableRowType,
    GaussTableRowType,
    LocalMinTableRowType,
    StaticTableRowType
} from '../src/table/tableRowType'

describe('TwitterChart', () => {
    it('create date chart', async () => {
        const table = new Table([
            new DateTableRowType('Date'),
            new StaticTableRowType('Cases'),
            new AvgNTableRowType('Cases (Avg 7)', 1, 7),
            new GaussTableRowType('Cases (Avg 7, smooth)', 2, 1),
            new LocalMinTableRowType('Minima', 3)
        ])
        const rows = [
            [
                new Date(2020, 1, 1),
                new Date(2020, 1, 2),
                new Date(2020, 1, 3),
                new Date(2020, 1, 4),
                new Date(2020, 1, 5),
                new Date(2020, 1, 6),
                new Date(2020, 1, 7),
                new Date(2020, 1, 8),
                new Date(2020, 1, 9),
                new Date(2020, 1, 10),
                new Date(2020, 1, 11),
                new Date(2020, 1, 12),
                new Date(2020, 1, 13),
                new Date(2020, 1, 14),
            ],
            [70, 30, 78, 81, 66, 43, 31, 48, 93, 56, 91, 25, 19, 17,],
        ]
        table.insertRows(rows)

        const twitterchart = new TwitterChart(
            'Title', 'Subtitle', 'X-axis', 'Y-axis', 0
        )
        twitterchart.data = [
            {
                axis: TwitterChartSeriesAxisType.x,
                type: TwitterChartSeriesConfigType.dot,
                label: table.columnTitles[0],
                color: [0, 0, 0, 1],
                data: table.data[0]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.dot,
                label: table.columnTitles[1],
                color: [0, 0, 200, 1],
                data: table.data[1]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.line,
                label: table.columnTitles[2],
                color: [0, 0, 0, 1],
                data: table.data[2]
            },
            {
                axis: TwitterChartSeriesAxisType.x,
                type: TwitterChartSeriesConfigType.label,
                label: 'Minimum',
                color: [0, 0, 0, 1],
                data: table.data[4]
            },
        ]
        await twitterchart.save('./test/out/test.png')
        looksSame('./test/out/expected.png', './test/out/test.png',
            (_, { equal }) => {
                expect(equal).to.equal(true)
            })
    })

    it('create number chart', async () => {
        const table = new Table([
            new DateTableRowType('Date'),
            new StaticTableRowType('Cases'),
            new AvgNTableRowType('Cases (Avg 7)', 1, 7)
        ])
        const rows = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
            [70, 30, 78, 81, 66, 43, 31, 48, 93, 56, 91, 25, 19, 17,],
        ]
        table.insertRows(rows)
        const twitterchart = new TwitterChart(
            'Title', 'Subtitle', 'X-axis', 'Y-axis', 0
        )
        twitterchart.data = [
            {
                axis: TwitterChartSeriesAxisType.x,
                type: TwitterChartSeriesConfigType.dot,
                label: table.columnTitles[0],
                color: [0, 0, 0, 1],
                data: table.data[0]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.dot,
                label: table.columnTitles[1],
                color: [0, 0, 200, 1],
                data: table.data[1]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.line,
                label: table.columnTitles[2],
                color: [0, 0, 0, 1],
                data: table.data[2]
            }
        ]
        await twitterchart.save('./test/out/test2.png')
        looksSame('./test/out/expected2.png', './test/out/test2.png',
            (_, { equal }) => {
                expect(equal).to.equal(true)
            })
    })
})