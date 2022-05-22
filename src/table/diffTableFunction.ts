import { BasicTableFunction } from './basicTableFunction.js'

export class DiffTableFunction extends BasicTableFunction {
    override calculate(data: any[][]): number {
        const sourceRow = this.sourceColumn(data)
        if (sourceRow.length < 2) return 0
        return sourceRow[sourceRow.length - 1] - sourceRow[sourceRow.length - 2]
    }
}