import { BasicTableFunction } from './basicTableFunction.js'

export class AutoIncrementTableFunction extends BasicTableFunction {
    extraRows: number

    constructor(extraRows: number = 0) {
        super(0, 0)
        this.extraRows = extraRows
    }

    override calculate(data: any[][]): number[] {
        const result = []
        const limit = this.sourceColumn(data).length - 1 + this.extraRows
        for (let i = 1; i < limit; i++) result.push(i)
        return result
    }
}