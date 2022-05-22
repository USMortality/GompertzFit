import { TableFunction } from './basicTableFunction.js'
import { assert } from 'console'
import { TableFunctionFactory } from './tableFunctionFactory.js'
import { FunctionalTableRowType, TableRowType } from './tableRowType.js'

export class Table {
    columnTitles: string[] = []
    private tableRowTypes: TableRowType[] = []
    private dataFunctionDefinitions: FunctionalTableRowType[] = []
    public data: any[] = []

    constructor(
        tableRowTypes: TableRowType[]
    ) {
        for (const rowType of tableRowTypes) {
            this.tableRowTypes.push(rowType)
            this.columnTitles.push(rowType.title)
            if (rowType instanceof FunctionalTableRowType) {
                this.dataFunctionDefinitions.push(rowType)
            }
            this.data.push([])
        }
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
            const targetColumnIndex = this.staticColumnLength() + funIndex
            const fun: TableFunction = TableFunctionFactory.getFunction(
                targetColumnIndex, dataFunctionDefinition
            )
            this.data[targetColumnIndex].push(fun.calculate(this.data))
            funIndex++
        }
    }

    private staticColumnLength(): number {
        return this.data.length - this.dataFunctionDefinitions.length
    }

    print(): void {
        console.log(this.data)
    }
}