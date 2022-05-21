import { BasicTableFunction } from './basicTableFunction'

export class SumTableFunction extends BasicTableFunction {
    override calculate(data: any[][]): number {
        return this.lastTargetElement(data) + this.lastSourceElement(data)
    }
}