import { zeroIfNanOrInfinite } from '../common.js'
import { BasicTableFunction } from './basicTableFunction.js'

export class GompertzJtS1TableFunction extends BasicTableFunction {

    override calculate(data: any[][]): number[] {
        const columnData = this.sourceColumn(data)

        const growthFactors = []
        // Calculate log[Exp. Grow. Factor]
        for (let i = 0; i < columnData.length; i++) {
            // Calculate factor
            const factor = Math.log(columnData[i] / columnData[i - 1])
            const value = Math.log10(zeroIfNanOrInfinite(factor))
            growthFactors.push(zeroIfNanOrInfinite(value))
        }

        return growthFactors
    }
}
