import { BasicTableFunction } from './basicTableFunction.js'
import { solve, GompertzParams } from './../solver.js'

export class GompertzTableFunction extends BasicTableFunction {
    tColumnIndex: number

    constructor(
        columnIndex: number,
        sourceColumnIndex: number,
        tColumnIndex: number
    ) {
        super(columnIndex, sourceColumnIndex)
        this.tColumnIndex = tColumnIndex
    }

    override calculate(data: any[][]): number[] {
        const result = []
        const config: GompertzParams = solve(
            data[this.sourceColumnIndex], this.gompertzDerivative
        )

        for (const cell of data[this.tColumnIndex]) {
            result.push(
                this.gompertzDerivative(cell, config.a, config.b, config.c)
            )
        }

        return result
    }

    gompertzDerivative(t: number, a: number, b: number, c: number): number {
        return a * b * c * Math.exp(b * Math.exp(c * t)) * Math.exp(c * t)
    }
}