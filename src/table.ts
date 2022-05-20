import { assert } from 'console'
import lowess from '@stdlib/stats-lowess'

export class Table {
    columns: string[]
    dataFunctions: ((data: any[]) => any)[]
    data: any[] = []
    dataCalculated: any[] = []

    constructor(
        columns: string[],
        dataFunctions: ((data: any[]) => any)[]
    ) {
        this.columns = columns
        this.dataFunctions = dataFunctions
        for (const _ of columns) this.data.push([])
        for (const _ of dataFunctions) this.dataCalculated.push([])

        // let x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
        // let y = [2, 10, 4, 22, 16, 29, 33, 35, 27, 26, 45, 50, 55, 33]
        // console.log(lowess(x, y))
    }

    insertRow(row: any[]): void {
        assert(row.length === this.data.length)

        for (let i = 0; i < row.length; i++) {
            this.data[i].push(row[i])
        }

        this.recalculateDataFunctions()
    }

    insertRows(rows: any[][]): void {
        for (const row of rows) this.insertRow(row)
    }

    recalculateDataFunctions(): void {
        let funIndex = 0
        for (const fun of this.dataFunctions) {
            this.dataCalculated[funIndex++].push(fun(this.data))
        }
    }

    getData(): any[] {
        return this.data.concat(this.dataCalculated)
    }

    print(): void {
        console.log(this.getData())
    }
}