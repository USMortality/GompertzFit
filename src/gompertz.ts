import { Series } from './series.js'
import { solve, GompertzParams } from './solver.js'
import { Slice } from './slice.js'

function gompertzDerivative(
    t: number, a: number, b: number, c: number
): number {
    return a * b * c * Math.exp(b * Math.exp(c * t)) * Math.exp(c * t)
}

export class Gompertz {
    private series: Series
    private additionalDays: number

    end: number

    constructor(series: Series, additionalDays: number) {
        this.series = series
        this.additionalDays = additionalDays
    }

    fit(slice: Slice): number[] {
        const data = this.series.getNewCasesAvgSmooth()
        const backgroundRate = data[slice.start]
        const trainingData = data.slice(slice.start, slice.start + this.end + 1)
        const trainingDataMinusBG = trainingData.map(value => {
            return value - backgroundRate
        })
        const config: GompertzParams =
            solve(trainingDataMinusBG, gompertzDerivative)

        const result = []
        const endIndex = slice.end - slice.start + this.additionalDays
        for (let i = 0; i <= endIndex; i++) {
            const f = gompertzDerivative(i, config.a, config.b, config.c)
            result.push(Math.round(f))
        }

        return result.map(val => val + backgroundRate)
    }
}
