import { TableFunction } from './basicTableFunction.js'
import { assert } from 'console'
import { TableFunctionFactory } from './tableFunctionFactory.js'
import { BasicFunctionalTableRowType, TableRowType } from './tableRowType.js'
import os from 'os'
import fs from 'fs'
import { dateString } from '../common.js'

export type DataType = number[] | Date[]

export class Table {
  columnTitles: string[] = []
  private tableRowTypes: TableRowType[] = []
  private dataFunctionDefinitions: BasicFunctionalTableRowType[] = []
  public data: DataType[] = []

  constructor(tableRowTypes: TableRowType[]) {
    for (const rowType of tableRowTypes) {
      this.tableRowTypes.push(rowType)
      this.columnTitles.push(rowType.title)
      if (rowType instanceof BasicFunctionalTableRowType) {
        this.dataFunctionDefinitions.push(rowType)
      }
      this.data.push([])
    }
  }

  insertRow(row: DataType, recalculate = true): void {
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

  insertRows(data: DataType[]): void {
    assert(data.length === this.staticColumnLength(), 'insertRows')

    for (let rowIndex = 0; rowIndex < data[0].length; rowIndex++) {
      const result: DataType = []
      for (const column of data) {
        const value = column[rowIndex]
        if (typeof value === 'number') {
          const resultArr = result as number[]
          resultArr.push(value)
        } else if (value instanceof Date) {
          const resultArr = result as Date[]
          resultArr.push(value)
        }
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

  splitAt(columnIndex: number, comparator: number): DataType[][] {
    const result: DataType[][] = []
    let lastRowIndex = 0

    for (let i = 0; i < this.data[columnIndex].length; i++) {
      const subTableResult: (DataType)[] = []
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

  print = () => console.log(JSON.stringify(this.data, null, 2))

  saveCsv(filepath: string): void {
    let result = this.makeCsvRow(this.columnTitles)
    for (let rowIndex = 0; rowIndex < this.data[0].length; rowIndex++) {
      const data: number[] | string[] = []
      for (const column of this.data) {
        if (typeof column[0] === 'number') {
          const columnTyped = column as number[]
          const dataTyped = data as number[]
          dataTyped.push(columnTyped[rowIndex])
        } else if (column[0] instanceof Date) {
          const columnTyped = column as Date[]
          const dataTyped = data as string[]
          dataTyped.push(dateString(columnTyped[rowIndex]))
        } else {
          throw new Error('Tyring to insert unsupported cell type.')
        }
      }
      result += this.makeCsvRow(data)
    }
    fs.writeFile(filepath, result, err => {
      if (err) return console.log(err)
    })
  }

  extendColumn(columnIndex: number, extender: DataType): void {
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

  private staticColumnLength = () =>
    this.data.length - this.dataFunctionDefinitions.length

  private makeCsvRow = (arr: number[] | string[]) =>
    `"${Object.values(arr).join('","')}"${os.EOL}`
}
