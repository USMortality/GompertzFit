import { BasicTableFunction } from './basicTableFunction.js'

export class AutoIncrementTableFunction extends BasicTableFunction {
    override calculate(data: any[][]): number {
        return (this.lastTargetElement(data) ? this.lastTargetElement(data) : 0)
            + 1
    }
}