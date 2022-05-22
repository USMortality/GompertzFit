import {
    AutoIncrementTableRowType,
    AvgNTableRowType,
    AvgTableRowType,
    DiffTableRowType,
    LoessTableRowType,
    StaticTableRowType,
    SumNTableRowType,
    SumTableRowType
} from '../src/table/tableRowType.js'
import { Table } from '../src/table/table.js'
import { expect } from 'chai'

const rows = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    [10, 13, 7, 8, 11, 15, 18, 10, 13, 7, 8, 11, 15, 18]
]

describe('table', () => {
    it('create new table', () => {
        const table = new Table(
            [
                new StaticTableRowType('t'),
                new StaticTableRowType('Cases'),
                new SumTableRowType('Cases Sum', 1)
            ]
        )
        expect(table.data.length).to.equal(3)
    })

    it('insert rows', () => {
        const table = new Table(
            [
                new StaticTableRowType('t'),
                new StaticTableRowType('Cases'),
                new SumTableRowType('Cases Sum', 1),
                new SumNTableRowType('Cases Sum', 1, 7)
            ]
        )
        table.insertRow([1, 0])
        table.insertRow([2, 2])
        table.insertRow([3, 7])
        table.insertRow([4, 3])
        table.insertRow([5, 11])

        expect(table.data.length).to.equal(4)
        expect(table.data[0].length).to.equal(5)
        expect(table.data[1][4]).to.equal(11)
    })

    it('insertRows', () => {
        const table = new Table(
            [
                new StaticTableRowType('t'),
                new StaticTableRowType('Cases'),
                new SumTableRowType('Cases Sum', 1),
                new SumNTableRowType('Cases Sum', 1, 7)
            ]
        )
        table.insertRows([
            [1, 2, 3, 4, 5, 6, 7],
            [10, 13, 7, 8, 11, 15, 18]
        ])
        table.insertRows([
            [8, 9, 10, 11, 12, 13, 14],
            [10, 13, 7, 8, 11, 15, 18]
        ])

        expect(table.data.length).to.equal(4)
        expect(table.data[0].length).to.equal(14)
        expect(table.data[1][6]).to.equal(18)
    })

    it('sumFunction', () => {
        const table = new Table(
            [
                new StaticTableRowType('t'),
                new StaticTableRowType('Cases'),
                new SumTableRowType('Cases Sum', 1)
            ]
        )
        table.insertRows(rows)

        expect(table.data[2][13]).to.equal(164)
    })

    it('sumNFunction', () => {
        const table = new Table(
            [
                new StaticTableRowType('t'),
                new StaticTableRowType('Cases'),
                new SumNTableRowType('Cases Sum', 1, 7)
            ]
        )
        table.insertRows(rows)

        expect(table.data[2][13]).to.equal(82)
    })

    it('loessFunction', () => {
        const table = new Table(
            [
                new StaticTableRowType('t'),
                new StaticTableRowType('Cases'),
                new SumNTableRowType('Cases Sum', 1, 7),
                new LoessTableRowType('Cases Avg', 1, 0),
                new LoessTableRowType('Cases 7day Avg', 2, 0)
            ]
        )
        table.insertRows(rows)

        expect(table.data[3][13]).to.equal(15.9)
        expect(table.data[4][11]).to.equal(82.6)
    })

    it('autoIncrementFunction', () => {
        const table = new Table(
            [
                new StaticTableRowType('t'),
                new StaticTableRowType('Cases'),
                new AutoIncrementTableRowType('t', 0)
            ]
        )
        table.insertRows(rows)
        expect(table.data[0]).to.eql(table.data[2])
    })

    it('avgFunction', () => {
        const table = new Table(
            [
                new StaticTableRowType('t'),
                new StaticTableRowType('Cases'),
                new AvgTableRowType('t', 1)
            ]
        )
        table.insertRows(rows)
        expect(table.data[2][9]).to.equal(11.2)
    })

    it('avgNFunction', () => {
        const table = new Table(
            [
                new StaticTableRowType('t'),
                new StaticTableRowType('Cases'),
                new AvgNTableRowType('t', 1, 7)
            ]
        )
        table.insertRows(rows)
        expect(table.data[2][13]).to.equal(11.714285714285714)
    })

    it('diffFunction', () => {
        const table = new Table(
            [
                new StaticTableRowType('t'),
                new StaticTableRowType('Cases'),
                new DiffTableRowType('diff', 0)
            ]
        )
        table.insertRows(rows)
        expect(table.data[2]).to.eql(
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,]
        )
    })

    it('real example', () => {
        const table = new Table(
            [
                new StaticTableRowType('Date'),
                new StaticTableRowType('Cumulative Cases'),
                new AutoIncrementTableRowType('t', 0),
                new DiffTableRowType('Daily Cases', 1),
                new AvgNTableRowType('Cases (7d AVG)', 3, 7),
                new LoessTableRowType('Cases (7d AVG, smooth)', 4, 2)
            ]
        )
        table.insertRows([
            ['2022-01-01T00:00:00.000Z',
                '2022-01-02T00:00:00.000Z',
                '2022-01-03T00:00:00.000Z',
                '2022-01-04T00:00:00.000Z',
                '2022-01-05T00:00:00.000Z',
                '2022-01-06T00:00:00.000Z',
                '2022-01-07T00:00:00.000Z',
                '2022-01-08T00:00:00.000Z',
                '2022-01-09T00:00:00.000Z',
                '2022-01-10T00:00:00.000Z',
                '2022-01-11T00:00:00.000Z',
                '2022-01-12T00:00:00.000Z',
                '2022-01-13T00:00:00.000Z',
                '2022-01-14T00:00:00.000Z'],
            [
                11769282,
                11970948,
                12150766,
                12297353,
                12478864,
                12652425,
                12832636,
                12949885,
                13164520,
                13332743,
                13473088,
                13628002,
                13825118,
                14021279
            ]
        ])
        table.print()
        expect(table.data[3][13]).to.equal(196161)
        expect(table.data[4][13]).to.equal(169806.14285714287)
        expect(table.data[5][13]).to.equal(168421.3794513356)
    })

})