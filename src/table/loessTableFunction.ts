import { BasicTableFunction } from './basicTableFunction.js'
import lowess from '@stdlib/stats-lowess'
import { fillerArray } from '../common.js'

export class LoessTableFunction extends BasicTableFunction {
  xColumnIndex: number
  smoothFactor: number

  constructor(
    columnIndex: number,
    sourceColumnIndex: number,
    xColumnIndex: number,
    smoothFactor: number
  ) {
    super(columnIndex, sourceColumnIndex)
    this.xColumnIndex = xColumnIndex
    this.smoothFactor = smoothFactor
  }

  override calculate(data: number[][]): number[] {
    const dataColumn = this.sourceColumn(data)
    if (dataColumn.length < 2) return fillerArray(dataColumn.length, 0)

    return this.getLoess(
      data[this.xColumnIndex].slice(0, dataColumn.length),
      dataColumn,
      this.smoothFactor
    )
  }

  getLoess(
    t: number[],
    values: number[],
    smoothFactor: number
  ): number[] {
    return lowess(t, values, { f: smoothFactor, sorted: true }).y
  }
}
