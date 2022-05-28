import { BasicTableFunction } from './basicTableFunction.js'

export class SumNTableFunction extends BasicTableFunction {
  private n: number

  constructor(columnIndex: number, sourceColumnIndex: number, n: number) {
    super(columnIndex, sourceColumnIndex)
    this.n = n
  }

  override calculate(data: number[][]): number[] {
    const result = []
    const columnData = this.sourceColumn(data)
    for (let i = 0; i < columnData.length; i++) {
      if (i === 0) {
        result.push(columnData[i])
        continue
      }

      const start = this.getStart(data, this.n)
      let sum = 0
      for (let j = start; j < columnData.length; j++) {
        sum += columnData[j]
      }

      result.push(sum)
    }
    return result
  }
}
