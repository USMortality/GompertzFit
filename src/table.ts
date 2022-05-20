import { assert } from 'console'

export class Table {
    columns: string[]
    dataFunctions: ((data: any[]) => any)[]
    data: any[] = []
    dataCalculated: any[] = []

    constructor(
        columns: string[],
        dataFunctions: ((data: any[]) => any)[] = []
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

    insertRows(data: any[][]): void {
        assert(data.length === this.columns.length)

        for (let rowIndex = 0; rowIndex < data[0].length; rowIndex++) {
            const result = []
            for (let colIndex = 0; colIndex < data.length; colIndex++) {
                result.push(data[colIndex][rowIndex])
            }
            this.insertRow(result)
        }
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