import { BasicTableFunction } from './basicTableFunction.js'

export class AvgTableFunction extends BasicTableFunction {
  override calculate(data: any[][]): number[] {
    const result = []
    const columnData = this.sourceColumn(data)

    for (let i = 1; i <= columnData.length; i++) {
      let sum = 0
      for (let j = 0; j < i; j++) {
        sum += columnData[j]
      }
      result.push(sum / i)
    }
    return result
  }
}