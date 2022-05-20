import { assert } from 'console'

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
    }

    insertRow(row: any[]): void {
        assert(row.length === this.data.length)
        for (let i = 0; i < row.length; i++) this.data[i].push(row[i])
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