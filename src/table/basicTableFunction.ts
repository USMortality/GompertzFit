import { DataType } from './table'

export interface TableFunction {
  calculate(data: DataType[]): number | number[]
}

export abstract class BasicTableFunction implements TableFunction {
  columnIndex: number
  sourceColumnIndex: number

  constructor(
    columnIndex: number,
    sourceColumnIndex: number
  ) {
    this.columnIndex = columnIndex
    this.sourceColumnIndex = sourceColumnIndex
  }

  abstract calculate(data: number[][]): number[]

  lastTargetElement(data: number[][]): number {
    const targetRow = this.targetColumn(data)
    return targetRow.length > 0 ? targetRow[targetRow.length - 1] : 0
  }

  lastSourceElement(data: number[][]): number {
    const sourceRow = this.sourceColumn(data)
    return sourceRow[sourceRow.length - 1]
  }

  targetColumn(data: number[][]): number[] {
    return data[this.columnIndex]
  }

  sourceColumn(data: number[][]): number[] {
    return data[this.sourceColumnIndex]
  }

  getStart(data: number[][], n: number): number {
    const columnData = this.sourceColumn(data)
    return columnData.length < n ? 0 : columnData.length - n
  }
}
