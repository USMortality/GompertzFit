import { BasicTableFunction } from './basicTableFunction.js'

export enum ArithmeticFunction { ADD, SUB, MUL, DIV }

export class ArithmeticTableFunction extends BasicTableFunction {
  private arithmeticFunction: ArithmeticFunction
  private termColumnIndex: number
  private termRowIndex: number

  constructor(
    columnIndex: number,
    sourceColumnIndex: number,
    arithmeticFunction: ArithmeticFunction,
    termColumnIndex: number,
    termRowIndex: number
  ) {
    super(columnIndex, sourceColumnIndex)
    this.arithmeticFunction = arithmeticFunction
    this.termColumnIndex = termColumnIndex
    this.termRowIndex = termRowIndex
  }

  override calculate(data: number[][]): number[] {
    const term = data[this.termColumnIndex][this.termRowIndex]
    const result: number[] = []

    for (let i = 0; i < this.sourceColumn(data).length; i++) {
      const cell = data[this.sourceColumnIndex][i]
      switch (this.arithmeticFunction) {
        case ArithmeticFunction.ADD:
          result.push(cell + term)
          break
        case ArithmeticFunction.SUB:
          result.push(cell - term)
          break
        case ArithmeticFunction.MUL:
          result.push(cell * term)
          break
        case ArithmeticFunction.DIV:
          result.push(cell / term)
          break
      }
    }

    return result
  }
}
