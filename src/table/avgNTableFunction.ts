import { BasicTableFunction } from './basicTableFunction.js'

export class AvgNTableFunction extends BasicTableFunction {
  private n: number

  constructor(columnIndex: number, sourceColumnIndex: number, n: number) {
    super(columnIndex, sourceColumnIndex)
    this.n = n
  }

  override calculate(data: number[][]): number[] {
    const result = []
    const columnData = this.sourceColumn(data)
    for (let i = 1; i <= columnData.length; i++) {
      let sum = 0
      const start = i < this.n ? 0 : i - this.n
      for (let j = start; j < i; j++) {
        sum += columnData[j]
      }
      result.push(sum / Math.min(i, this.n))
    }
    return result
  }
}
