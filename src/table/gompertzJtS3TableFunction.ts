import { BasicTableFunction } from './basicTableFunction.js'

export class GompertzJtS3TableFunction extends BasicTableFunction {
  xColumnIndex: number
  s2ColumnIndex: number
  days: number

  constructor(
    columnIndex: number,
    sourceColumnIndex: number,
    xColumnIndex: number,
    s2ColumnIndex: number,
  ) {
    super(columnIndex, sourceColumnIndex)
    this.xColumnIndex = xColumnIndex
    this.s2ColumnIndex = s2ColumnIndex
  }

  override calculate(data: number[][]): number[] {
    const columnData = this.sourceColumn(data)
    const xData = data[this.xColumnIndex]
    const growthFactorsPredicted = data[this.s2ColumnIndex]
    // const xData = this.makeXRow(columnData.length)

    // Fill in actual values first
    const result = JSON.parse(JSON.stringify(columnData)) as number[]

    // Calculate Prediction Total
    for (let i = result.length - 1; i < xData.length - 1; i++) {
      const growthFactor = Math.exp(
        Math.pow(10, growthFactorsPredicted[i])
      )
      result.push(Math.round(result[result.length - 1] * growthFactor))
    }

    return result
  }
}
