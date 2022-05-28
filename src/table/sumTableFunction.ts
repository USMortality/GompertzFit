import { BasicTableFunction } from './basicTableFunction.js'

export class SumTableFunction extends BasicTableFunction {
  override calculate(data: number[][]): number[] {
    const result = []
    const columnData = this.sourceColumn(data)
    for (let i = 0; i < columnData.length; i++) {
      if (i === 0) result.push(columnData[i])
      else result.push(result[i - 1] + columnData[i])
    }
    return result
  }
}
