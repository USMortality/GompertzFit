import { Table } from '../src/table/table.js'
import {
    TwitterChart,
    TwitterChartSeriesAxisType,
    TwitterChartSeriesConfigType
} from './../src/twitterChart.js'
import 'jest'
import looksSame from 'looks-same'
import {
    ArithmeticTableRowType,
    AutoIncrementTableRowType,
    AvgNTableRowType,
    DateTableRowType,
    DiffTableRowType,
    GaussTableRowType,
    GompertzJtS1TableRowType,
    GompertzJtS2TableRowType,
    GompertzJtS3TableRowType,
    LocalExtremaTableRowType,
    LoessTableRowType,
    StaticTableRowType,
    SumTableRowType
} from '../src/table/tableRowType.js'
import { LocalExtramaType } from '../src/table/localExtremaTableFunction.js'
import { fillerAutoIncrementArray, numberWithCommas } from '../src/common.js'
import { ArithmeticFunction } from '../src/table/arithmeticTableFunction.js'

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
        await looksSameAsync('./test/out/test.png', './test/out/expected.png')
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
        await looksSameAsync('./test/out/test2.png', './test/out/expected2.png')
    })

    it('gompertz chart', async () => {
        const extraDays = 60
        const table = new Table([
            new StaticTableRowType('t'), // 0
            new StaticTableRowType('Cases'), // 1
            new AvgNTableRowType('Cases (7d AVG)', 1, 7), // 2
            new LoessTableRowType('Cases (7d AVG, Loess)', 2, 0), // 3
            new ArithmeticTableRowType('Cases (7d AVG) - Background',
                3, ArithmeticFunction.SUB, 3, 0), // 4
            new SumTableRowType('Reconstitute Total, X(t)', 4), // 5
            new AutoIncrementTableRowType('x', extraDays), // 6
            new GompertzJtS1TableRowType('Growth Line', 5), // 7
            new GompertzJtS2TableRowType('Growth Line Trend', 7, 6, 7), // 8
            new GompertzJtS3TableRowType('Prediction Total', 5, 6, 8), // 9
            new DiffTableRowType('Cases Predicted', 9), // 10
            new ArithmeticTableRowType('Cases Predicted + Background',
                10, ArithmeticFunction.ADD, 3, 0), // 11
            new LocalExtremaTableRowType('Max', 11, LocalExtramaType.MAX) // 12
        ])
        const cases = [
            50636, 75025, 12711, 9534, 40344, 35746, 55385, 50664, 35436, 12332,
            7503, 61394, 39266, 68940, 61697, 90049, 19731, 13490, 70213, 45348,
            90020, 77356, 61184, 23986, 16702, 94704, 49596, 112029, 88548,
            128758, 27806, 5744, 130029, 70210, 160162, 113974, 87314, 16952,
            24760, 177515, 82829, 208799, 132392, 146309, 25428, 18487, 108179,
            110870, 216703
        ]
        const rows = [
            fillerAutoIncrementArray(cases.length + extraDays, 0),
            cases,
        ]
        table.insertRows(rows)
        const chart = new TwitterChart(
            'COVID-19 Cases (Latest Wave)', '', 'Days', 'Cases', 0
        )
        const debugChart = new TwitterChart(
            'Gompertz Debug Chart', '', 'Days', 'Cases (Log)', 0
        )

        chart.data = [
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
                label: table.columnTitles[11],
                color: [0, 0, 0, 1],
                isDashed: true,
                data: table.data[11]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.line,
                label: table.columnTitles[3],
                color: [0, 0, 0, 1],
                isDashed: false,
                data: table.data[3]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.line,
                label: table.columnTitles[2],
                color: [0, 0, 200, 1],
                isDashed: false,
                data: table.data[2]
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
                axis: TwitterChartSeriesAxisType.x,
                type: TwitterChartSeriesConfigType.label,
                label: (rowIndex: number): string[] => {
                    return [
                        'Max',
                        numberWithCommas(table.data[11][rowIndex]),
                        table.data[0][rowIndex]]
                },
                color: [255, 0, 0, .5],
                isDashed: true,
                data: table.data[12]
            },
        ]

        debugChart.data = [
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
                label: table.columnTitles[8],
                color: [124, 166, 216, 1],
                isDashed: true,
                data: table.data[8]
            },
            {
                axis: TwitterChartSeriesAxisType.y,
                type: TwitterChartSeriesConfigType.line,
                label: table.columnTitles[7],
                color: [0, 0, 255, 1],
                isDashed: false,
                data: table.data[7]
            },
            {
                axis: TwitterChartSeriesAxisType.y2,
                type: TwitterChartSeriesConfigType.line,
                label: table.columnTitles[5],
                color: [255, 0, 0, 1],
                isDashed: false,
                data: table.data[5]
            },
            {
                axis: TwitterChartSeriesAxisType.y2,
                type: TwitterChartSeriesConfigType.line,
                label: table.columnTitles[9],
                color: [255, 0, 0, 1],
                isDashed: true,
                data: table.data[9]
            },
        ]

        await chart.save('./test/out/test3.png')
        await looksSameAsync('./test/out/test3.png', './test/out/expected3.png')
        await debugChart.save('./test/out/test3d.png')
        await looksSameAsync(
            './test/out/test3d.png',
            './test/out/expected3d.png'
        )
    })

    function looksSameAsync(file1: string, file2: string): Promise<void> {
        return new Promise((resolve, reject) => {
            looksSame(file1, file2, (_, { equal }) => {
                if (equal) resolve()
                else reject(`Image: '${file1}' does not match '${file2}'.`)
            })
        })
    }
})