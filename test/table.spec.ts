import { TableFunctionType } from './../src/tableFunctionFactory'
import { Table } from '../src/table.js'
import { expect } from 'chai'

const rows = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    [10, 13, 7, 8, 11, 15, 18, 10, 13, 7, 8, 11, 15, 18]
]

describe('table', () => {
    it('create new table', () => {
        const table = new Table(
            ['date', 'cases'],
            [
                {
                    tableFunctionType: TableFunctionType.Sum,
                    targetColumnIndex: 1
                }
            ]
        )
        expect(table.data.length).to.equal(3)
    })

    it('insert rows', () => {
        const table = new Table(
            ['date', 'cases'], [
            {
                tableFunctionType: TableFunctionType.Sum,
                targetColumnIndex: 1
            },
            {
                tableFunctionType: TableFunctionType.Sum7,
                targetColumnIndex: 1
            }
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
            ['date', 'cases'],
            [
                {
                    tableFunctionType: TableFunctionType.Sum,
                    targetColumnIndex: 1
                },
                {
                    tableFunctionType: TableFunctionType.Sum7,
                    targetColumnIndex: 1
                }
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
            ['date', 'cases'],
            [
                {
                    tableFunctionType: TableFunctionType.Sum,
                    targetColumnIndex: 1
                }
            ]
        )
        table.insertRows(rows)

        expect(table.data[2][13]).to.equal(164)
    })

    it('sumNFunction', () => {
        const table = new Table(
            ['date', 'cases'],
            [
                {
                    tableFunctionType: TableFunctionType.Sum7,
                    targetColumnIndex: 1
                }
            ]
        )
        table.insertRows(rows)

        expect(table.data[2][13]).to.equal(82)
    })

    it('loessFunction', () => {
        const table = new Table(
            ['date', 'cases'],
            [
                {
                    tableFunctionType: TableFunctionType.Sum7,
                    targetColumnIndex: 1
                },
                {
                    tableFunctionType: TableFunctionType.Loess,
                    targetColumnIndex: 1
                },
                {
                    tableFunctionType: TableFunctionType.Loess,
                    targetColumnIndex: 2
                }
            ]
        )
        table.insertRows(rows)

        expect(table.data[3][13]).to.equal(15.9)
        expect(table.data[4][11]).to.equal(82.6)
    })
})