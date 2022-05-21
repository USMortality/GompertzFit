import { TableFunction } from './basicTableFunction'
import { assert } from 'console'
import { TableFunctionDefinition, TableFunctionFactory } from './tableFunctionFactory'

export class Table {
    private columns: string[]
    private dataFunctionDefinitions: TableFunctionDefinition[]
    public data: any[] = []

    constructor(
        columns: string[],
        dataFunctionDefinitions: TableFunctionDefinition[] = []
    ) {
        this.columns = columns
        this.dataFunctionDefinitions = dataFunctionDefinitions
        for (const _ of columns) this.data.push([])
        for (const _ of dataFunctionDefinitions) this.data.push([])
    }

    insertRow(row: any[]): void {
        assert(row.length === this.staticColumnLength())
        for (let i = 0; i < row.length; i++) this.data[i].push(row[i])
        this.recalculateDataFunctions()
    }

    insertRows(data: any[][]): void {
        assert(data.length === this.staticColumnLength())

        for (let rowIndex = 0; rowIndex < data[0].length; rowIndex++) {
            const result = []
            for (const colIndex in data) {
                if (Object.prototype.hasOwnProperty.call(data, colIndex)) {
                    result.push(data[colIndex][rowIndex])
                }
            }
            this.insertRow(result)
        }
    }

    private recalculateDataFunctions(): void {
        let funIndex = 0
        for (const dataFunctionDefinition of this.dataFunctionDefinitions) {
            const fun: TableFunction =
                TableFunctionFactory.getFunction(dataFunctionDefinition)
            this.data[this.columns.length + funIndex++].push(
                fun.calculate(this.data)
            )
        }
    }

    private staticColumnLength(): number {
        return this.data.length - this.dataFunctionDefinitions.length
    }

    print(): void {
        console.log(this.data)
    }
}