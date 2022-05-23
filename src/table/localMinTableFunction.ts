import { BasicTableFunction } from './basicTableFunction.js'

export class LocalMinTableFunction extends BasicTableFunction {
    override calculate(data: any[][]): number | number[] {
        const sourceColumn = this.sourceColumn(data)
        const len = sourceColumn.length
        if (len < 3) return 0

        const prev = sourceColumn[len - 3]
        const curr = sourceColumn[len - 2]
        const next = sourceColumn[len - 1]

        if (prev > curr && curr < next) {
            const targetColumn = this.targetColumn(data)
            targetColumn[targetColumn.length - 1] = 1
            targetColumn.push(0)
            return targetColumn
        } else {
            return 0
        }
    }
}