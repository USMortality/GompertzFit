import { TableFunction } from './basicTableFunction.js'
import { assert } from 'console'
import { TableFunctionFactory } from './tableFunctionFactory.js'
import { BasicFunctionalTableRowType, TableRowType } from './tableRowType.js'
import os from 'os'
import fs from 'fs'

export class Table {
  columnTitles: string[] = []
  private tableRowTypes: TableRowType[] = []
  private dataFunctionDefinitions: BasicFunctionalTableRowType[] = []
  public data: (Date[] | number[])[] = []

  constructor(
    tableRowTypes: TableRowType[]
  ) {
    const a: (number[] | Date[])[] = []
    a.push([1, 1])
    a.push([new Date()])

    for (const rowType of tableRowTypes) {
      this.tableRowTypes.push(rowType)
      this.columnTitles.push(rowType.title)
      if (rowType instanceof BasicFunctionalTableRowType) {
        this.dataFunctionDefinitions.push(rowType)
      }
      this.data.push([])
    }
  }

  insertRow(row: number[] | Date[], recalculate = true): void {
    for (let i = 0; i < row.length; i++) {
      if (typeof row[i] === 'number') {
        const numberRow = row[i] as number
        const numberArr = this.data[i] as number[]
        numberArr.push(numberRow)
      } else if (typeof row[i] === 'object') {
        const dateRow = row[i] as Date
        const dateArr = this.data[i] as Date[]
        dateArr.push(dateRow)
      }
    }
    if (recalculate) this.recalculateDataFunctions()
  }

  insertRows(data: (Date[] | number[])[]): void {
    assert(data.length === this.staticColumnLength(), 'insertRows')

    for (let rowIndex = 0; rowIndex < data[0].length; rowIndex++) {
      const result = []
      for (const column of data) {
        const value = column[rowIndex]
        if (value !== undefined) result.push(value)
      }
      this.insertRow(result, false)
    }
    this.recalculateDataFunctions()
  }

  getRowAt(rowIndex: number): number[] {
    const result: number[] = []
    for (const column of this.data) {
      result.push(column[rowIndex] as number)
    }
    return result
  }

  splitAt(columnIndex: number, comparator: number): (Date[] | number[])[][] {
    const result: (Date[] | number[])[][] = []
    let lastRowIndex = 0

    for (let i = 0; i < this.data[columnIndex].length; i++) {
      const subTableResult: (number[] | Date[])[] = []
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
    console.log(JSON.stringify(this.data, null, 2))
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
    fs.writeFile(filepath, result, err => {
      if (err) return console.log(err)
    })
  }

  extendColumn(columnIndex: number, extender: number[] | Date[]): void {
    const column = this.data[columnIndex]
    if (column.length === 0) {
      this.data[columnIndex] = extender
    } else if (typeof column[0] === 'number' && typeof extender[0] === 'number') {
      const columnTyped = column as number[]
      this.data[columnIndex] = columnTyped.concat(extender as number[])
    } else if (column[0] instanceof Date && extender[0] instanceof Date) {
      const columnTyped = column as Date[]
      this.data[columnIndex] = columnTyped.concat(extender as Date[])
    } else {
      throw new Error('Trying to merge two columns with different types.')
    }
  }

  reduceColumn(columnIndex: number, length: number): void {
    const currLength = this.data[columnIndex].length
    this.data[columnIndex].splice(currLength - length, length)
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
      else {
        const arr = this.data[targetColumnIndex] as number[]
        arr.push(data)
      }

      funIndex++
    }
  }

  private staticColumnLength(): number {
    return this.data.length - this.dataFunctionDefinitions.length
  }

  private makeCsvRow(arr: number[] | string[]): string {
    return `"${Object.values(arr).join('","')}"${os.EOL}`
  }
}
