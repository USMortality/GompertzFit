import { BasicTableFunction } from './basicTableFunction'
import lowess from '@stdlib/stats-lowess'

export class LoessTableFunction extends BasicTableFunction {
    override calculate(data: any[][]): number {
        const dataColumn = this.sourceRow(data)
        if (dataColumn.length < 2) return 0

        const loess = this.getLoess(data[0], dataColumn)
        return Math.round(loess[loess.length - 1] * 10) / 10
    }

    getLoess(
        t: number[],
        values: number[],
        smoothFactor: number = 2 / 3
    ): number[] {
        return lowess(t, values, { 'f': smoothFactor }).y
    }
}