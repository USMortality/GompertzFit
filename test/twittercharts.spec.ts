import { Table } from '../src/table/table.js'
import {
    TwitterChart,
    TwitterChartSeriesAxisType,
    TwitterChartSeriesConfigType
} from './../src/twitterChart.js'
import { expect } from 'chai'
import 'jest'
import looksSame from 'looks-same'
import {
    AutoIncrementTableRowType,
    AvgNTableRowType,
    DateTableRowType,
    GaussTableRowType,
    GompertzJtS1TableRowType,
    GompertzJtS2TableRowType,
    GompertzJtS3TableRowType,
    LocalExtremaTableRowType,
    StaticTableRowType
} from '../src/table/tableRowType.js'
import { LocalExtramaType } from '../src/table/localExtremaTableFunction.js'
import { fillerArray, fillerAutoIncrementArray } from '../src/common.js'

describe('TwitterChart', () => {
    it('create date chart', async () => {
        const table = new Table([
            new DateTableRowType('Date'),
            new StaticTableRowType('Cases'),
            new AvgNTableRowType('Cases (Avg 7)', 1, 7),
            new GaussTableRowType('Cases (Avg 7, smooth)', 2, 1),
            new LocalExtremaTableRowType('Minima', 3, LocalExtramaType.MIN)
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
                isDashed: false,
                data: table.data[0]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.dot,
                label: table.columnTitles[1],
                color: [0, 0, 200, 1],
                isDashed: false,
                data: table.data[1]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.line,
                label: table.columnTitles[2],
                color: [0, 0, 0, 1],
                isDashed: false,
                data: table.data[2]
            },
            {
                axis: TwitterChartSeriesAxisType.x,
                type: TwitterChartSeriesConfigType.label,
                label: 'Minimum',
                color: [0, 0, 0, 1],
                isDashed: false,
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
            new AvgNTableRowType('Cases (Avg 7)', 1, 7),
            new GaussTableRowType('Cases (Avg 7, smooth)', 2, 1),
            new LocalExtremaTableRowType('Min', 3, LocalExtramaType.MIN),
            new LocalExtremaTableRowType('Max', 3, LocalExtramaType.MAX)
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
                isDashed: false,
                data: table.data[0]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.dot,
                label: table.columnTitles[1],
                color: [0, 0, 200, 1],
                isDashed: false,
                data: table.data[1]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.line,
                label: table.columnTitles[2],
                color: [0, 0, 0, 1],
                isDashed: false,
                data: table.data[2]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.line,
                label: table.columnTitles[3],
                color: [0, 0, 255, 1],
                isDashed: true,
                data: table.data[3]
            },
            {
                axis: TwitterChartSeriesAxisType.x,
                type: TwitterChartSeriesConfigType.label,
                label: (rowIndex: number): string[] => {
                    return ['Minimum', table.data[0][rowIndex]]
                },
                color: [0, 0, 255, .5],
                isDashed: true,
                data: table.data[4]
            },
            {
                axis: TwitterChartSeriesAxisType.x,
                type: TwitterChartSeriesConfigType.label,
                label: (rowIndex: number): string[] => {
                    return ['Maximum', table.data[0][rowIndex]]
                },
                color: [255, 0, 0, .5],
                isDashed: true,
                data: table.data[5]
            },
        ]
        await twitterchart.save('./test/out/test2.png')
        looksSame('./test/out/expected2.png', './test/out/test2.png',
            (_, { equal }) => {
                expect(equal).to.equal(true)
            })
    })

    it('create number chart', async () => {
        const table = new Table([
            new DateTableRowType('Date'),
            new StaticTableRowType('Cases'),
            new AvgNTableRowType('Cases (Avg 7)', 1, 7),
            new GaussTableRowType('Cases (Avg 7, smooth)', 2, 1),
            new LocalExtremaTableRowType('Min', 3, LocalExtramaType.MIN),
            new LocalExtremaTableRowType('Max', 3, LocalExtramaType.MAX)
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
                isDashed: false,
                data: table.data[0]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.dot,
                label: table.columnTitles[1],
                color: [0, 0, 200, 1],
                isDashed: false,
                data: table.data[1]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.line,
                label: table.columnTitles[2],
                color: [0, 0, 0, 1],
                isDashed: false,
                data: table.data[2]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.line,
                label: table.columnTitles[3],
                color: [0, 0, 255, 1],
                isDashed: true,
                data: table.data[3]
            },
            {
                axis: TwitterChartSeriesAxisType.x,
                type: TwitterChartSeriesConfigType.label,
                label: (rowIndex: number): string[] => {
                    return ['Minimum', table.data[0][rowIndex]]
                },
                color: [0, 0, 255, .5],
                isDashed: true,
                data: table.data[4]
            },
            {
                axis: TwitterChartSeriesAxisType.x,
                type: TwitterChartSeriesConfigType.label,
                label: (rowIndex: number): string[] => {
                    return ['Maximum', table.data[0][rowIndex]]
                },
                color: [255, 0, 0, .5],
                isDashed: true,
                data: table.data[5]
            },
        ]
        await twitterchart.save('./test/out/test2.png')
        looksSame('./test/out/expected2.png', './test/out/test2.png',
            (_, { equal }) => {
                expect(equal).to.equal(true)
            })
    })

    it('gompertz chart', async () => {
        const table = new Table([
            new StaticTableRowType('t'), // 0
            new StaticTableRowType('Cases cumulative'), // 1
            new AutoIncrementTableRowType('x', 14), // 2
            new GompertzJtS1TableRowType('Growth Line', 1), // 3
            new GompertzJtS2TableRowType('Growth Line Trend', 3, 2, 14), // 4
            new GompertzJtS3TableRowType('Prediction Total', 1, 2, 4) // 5
        ])
        const rows = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
            [4, 11, 24, 43, 78, 136, 218, 358, 526, 663, 896, 1136, 1551],
        ]
        table.insertRows(rows)
        const twitterchart = new TwitterChart(
            'Title', 'Subtitle', 'X-axis', 'Y-axis', 0
        )

        table.extendColumn(0, fillerAutoIncrementArray(14, 14))

        twitterchart.data = [
            {
                axis: TwitterChartSeriesAxisType.x,
                type: TwitterChartSeriesConfigType.dot,
                label: table.columnTitles[0],
                color: [0, 0, 0, 1],
                isDashed: false,
                data: table.data[0]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.line,
                label: table.columnTitles[3],
                color: [0, 0, 255, 1],
                isDashed: false,
                data: table.data[3]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.line,
                label: table.columnTitles[4],
                color: [124, 166, 216, 1],
                isDashed: true,
                data: table.data[4]
            },
            {
                axis: TwitterChartSeriesAxisType.y2,
                type: TwitterChartSeriesConfigType.line,
                label: table.columnTitles[5],
                color: [255, 0, 0, 1],
                isDashed: true,
                data: table.data[5]
            },
            {
                axis: TwitterChartSeriesAxisType.y2,
                type: TwitterChartSeriesConfigType.line,
                label: table.columnTitles[1],
                color: [255, 0, 0, 1],
                isDashed: false,
                data: table.data[1]
            },
        ]

        await twitterchart.save('./test/out/test3.png')
        looksSame('./test/out/expected3.png', './test/out/test3.png',
            (_, { equal }) => {
                expect(equal).to.equal(true)
            })
    })
})