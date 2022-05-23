import { BasicTableFunction } from './basicTableFunction.js'

export class LocalMinTableFunction extends BasicTableFunction {
    override calculate(data: any[][]): number | number[] {
        const sourceColumn = this.sourceColumn(data)
        const len = sourceColumn.length
        if (len < 3) return 0

        if (sourceColumn[len - 3] > sourceColumn[len - 2] &&
            sourceColumn[len - 2] < sourceColumn[len - 1]) {
            const targetColumn = this.targetColumn(data)
            targetColumn[targetColumn.length - 1] = 1
            targetColumn.push(0)
            return targetColumn
        } else {
            return 0
        }
    }
}