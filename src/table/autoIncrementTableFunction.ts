import { BasicTableFunction } from './basicTableFunction.js'

export class AutoIncrementTableFunction extends BasicTableFunction {
    extraRows: number

    constructor(extraRows: number) {
        super(0, 0)
        this.extraRows = extraRows
    }

    override calculate(data: any[][]): number[] {
        const result = []
        const limit = this.sourceColumn(data).length + this.extraRows
        for (let i = 0; i < limit; i++) result.push(i + 1)
        return result
    }
}