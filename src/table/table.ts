import { TableFunction } from './basicTableFunction.js'
import { assert } from 'console'
import { TableFunctionFactory } from './tableFunctionFactory.js'
import { FunctionalTableRowType, TableRowType } from './tableRowType.js'
import os from 'os'
import fs from 'fs'

export class Table {
    columnTitles: string[] = []
    private tableRowTypes: TableRowType[] = []
    private dataFunctionDefinitions: FunctionalTableRowType[] = []
    public data: any[][] = []

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

    insertRow(row: any[], recalculate: boolean = true): void {
        assert(row.length === this.staticColumnLength(), 'insertRow')
        for (let i = 0; i < row.length; i++) this.data[i].push(row[i])
        if (recalculate) this.recalculateDataFunctions()
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
            this.insertRow(result, false)
        }
        this.recalculateDataFunctions()
    }

    getRowAt(rowIndex: number): any[] {
        const result = []
        for (const column of this.data) {
            result.push(column[rowIndex])
        }
        return result
    }

    splitAt(columnIndex: number, comparator: any): any[][] {
        const result: any[][] = []
        let lastRowIndex = 0

        for (let i = 0; i < this.data[columnIndex].length; i++) {
            const subTableResult = []
            if (this.data[columnIndex][i] === comparator
                || this.data[columnIndex].length - 1 === i) {
                for (const column of this.data) {
                    const subItem = column.slice(lastRowIndex, i)
                    subTableResult.push(subItem)
                }
                lastRowIndex = i
            } else continue

            result.push(subTableResult)
        }

        return result
    }

    print(): void {
        console.log(this.data)
    }

    saveCsv(filepath: string): void {
        let result = this.makeCsvRow(this.columnTitles)
        for (let row = 0; row < this.data[0].length; row++) {
            const data = []
            for (const column of this.data) {
                data.push(column[row])
            }
            result += this.makeCsvRow(data)
        }
        fs.writeFile(filepath, result, (err) => {
            if (err) return console.log(err)
        })
    }

    private recalculateDataFunctions(): void {
        let funIndex = 0
        for (const dataFunctionDefinition of this.dataFunctionDefinitions) {
            const targetColumnIndex = this.staticColumnLength() + funIndex
            const fun: TableFunction = TableFunctionFactory.getFunction(
                targetColumnIndex, dataFunctionDefinition
            )
            const data: number | number[] = fun.calculate(this.data)
            if (Array.isArray(data)) this.data[targetColumnIndex] = data
            else this.data[targetColumnIndex].push(data)
            funIndex++
        }
    }

    private staticColumnLength(): number {
        return this.data.length - this.dataFunctionDefinitions.length
    }

    private makeCsvRow(arr: any[]): string {
        return '"' + Object.values(arr).join('","') + '"' + os.EOL
    }
}