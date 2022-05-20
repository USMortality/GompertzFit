import { Table } from '../src/table.js'
import { sumFunction, sumNFunction, loessFunction } from '../src/tableFunctions'
import { expect } from 'chai'

const rows = [
    [1, 10],
    [2, 13],
    [3, 7],
    [4, 8],
    [5, 11],
    [6, 15],
    [7, 18],
    [8, 10],
    [9, 13],
    [10, 7],
    [11, 8],
    [12, 11],
    [13, 15],
    [14, 18]
]

describe('table.ts', () => {
    describe('table', () => {
        it('create new table', () => {
            const table = new Table(
                ['date', 'cases'], [sumFunction, sumNFunction]
            )
            const data = table.getData()
            expect(data.length).to.equal(4) //
        })

        it('insert rows', () => {
            const table = new Table(
                ['date', 'cases'], [sumFunction, sumNFunction]
            )
            table.insertRow([1, 0])
            table.insertRow([2, 2])
            table.insertRow([3, 7])
            table.insertRow([4, 3])
            table.insertRow([5, 11])

            const data = table.getData()
            expect(data.length).to.equal(4)
            expect(data[0].length).to.equal(5)
            expect(data[1][4]).to.equal(11)
        })

        it('insertRows', () => {
            const table = new Table(
                ['date', 'cases'], [sumFunction, sumNFunction]
            )
            table.insertRows([
                [1, 10],
                [2, 13],
                [3, 7],
                [4, 8],
                [5, 11],
                [6, 15],
                [7, 18]
            ])
            table.insertRows([
                [8, 10],
                [9, 13],
                [10, 7],
                [11, 8],
                [12, 11],
                [13, 15],
                [14, 18]
            ])

            const data = table.getData()
            expect(data.length).to.equal(4)
            expect(data[0].length).to.equal(14)
            expect(data[1][6]).to.equal(18)
        })

        it('sumFunction', () => {
            const table = new Table(
                ['date', 'cases'], [sumFunction]
            )
            table.insertRows(rows)

            const data = table.getData()
            expect(data[2][13]).to.equal(164)
        })

        it('sumNFunction', () => {
            const table = new Table(
                ['date', 'cases'], [sumNFunction]
            )
            table.insertRows(rows)

            const data = table.getData()
            expect(data[2][13]).to.equal(82)
        })

        it('loessFunction', () => {
            const table = new Table(
                ['date', 'cases'], [loessFunction]
            )
            table.insertRows(rows)

            const data = table.getData()
            expect(data[2][13]).to.equal(15.9)
        })
    })
})