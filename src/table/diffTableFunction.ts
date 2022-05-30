import { BasicTableFunction } from './basicTableFunction.js'

export class DiffTableFunction extends BasicTableFunction {
  override calculate(data: number[][]): number[] {
    const columnData = this.sourceColumn(data)
    const result: number[] = [0]

    for (let i = 1; i < columnData.length; i++) {
      result.push(columnData[i] - columnData[i - 1])
    }
    return result
  }
}
