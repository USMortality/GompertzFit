import { BasicTableFunction } from './basicTableFunction.js'

export class AvgTableFunction extends BasicTableFunction {
    override calculate(data: any[][]): number {
        let sum = 0
        const sourceColumn = this.sourceColumn(data)
        for (const val of sourceColumn) sum += val
        return sum / sourceColumn.length
    }
}