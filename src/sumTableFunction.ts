import { BasicTableFunction } from './basicTableFunction'

export class SumTableFunction extends BasicTableFunction {
    override calculate(data: any[][]): number {
        let sum = 0
        for (const element of data[this.targetColumnIndex]) sum += element
        return sum as any
    }
}