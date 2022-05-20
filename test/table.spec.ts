import { assert } from 'console'
import { Table } from '../src/table.js'
import { sumFunction, sumNFunction, lowessFunction } from '../src/tableFunctions'

describe('table.ts', () => {
    describe('table', () => {
        // it('create new table', () => {
        //     const table = new Table(['date', 'cases'], [
        //         sumFunction,
        //         sumNFunction
        //     ])
        //     table.insertRow([1, 0])
        //     table.insertRow([2, 2])
        //     table.insertRow([3, 7])
        //     table.insertRow([4, 3])
        //     table.insertRow([5, 11])
        //     table.print()
        // })

        // it('insertRows', () => {
        //     const table = new Table(['date', 'cases'], [
        //         sumFunction,
        //         sumNFunction
        //     ])
        //     table.insertRows([
        //         [1, 10],
        //         [1, 13],
        //         [1, 7],
        //         [1, 8],
        //         [1, 11],
        //         [1, 15],
        //         [1, 18]
        //     ])
        //     table.insertRows([
        //         [1, 10],
        //         [1, 13],
        //         [1, 7],
        //         [1, 8],
        //         [1, 11],
        //         [1, 15],
        //         [1, 18]
        //     ])

        //     table.print()
        // })

        it('lowess Rows', () => {
            const table = new Table(['date', 'cases'], [
                // sumNFunction,
                lowessFunction
            ])
            table.insertRows([
                [1, 2],
                [2, 10],
                [3, 4],
                [4, 22],
                [5, 16],
                [6, 29],
                [7, 33]
            ])
            table.insertRows([
                [8, 35],
                [9, 27],
                [10, 26],
                [11, 45],
                [12, 50],
                [13, 55],
                [14, 33]
            ])

            table.print()
        })
    })
})