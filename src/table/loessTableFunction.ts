import { BasicTableFunction } from './basicTableFunction.js'
import lowess from '@stdlib/stats-lowess'

export class LoessTableFunction extends BasicTableFunction {
    xColumnIndex: number

    constructor(
        columnIndex: number,
        sourceColumnIndex: number,
        xColumnIndex: number) {
        super(columnIndex, sourceColumnIndex)
        this.xColumnIndex = xColumnIndex
    }

    override calculate(data: any[][]): number {
        const dataColumn = this.sourceColumn(data)
        if (dataColumn.length < 2) return 0

        const loess = this.getLoess(data[this.xColumnIndex], dataColumn)
        return loess[loess.length - 1]
    }

    getLoess(
        t: number[],
        values: number[],
        smoothFactor: number = 2 / 3
    ): number[] {
        return lowess(t, values, { 'f': smoothFactor }).y
    }
}