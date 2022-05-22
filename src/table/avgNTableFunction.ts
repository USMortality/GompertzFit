import { BasicTableFunction } from './basicTableFunction.js'

export class AvgNTableFunction extends BasicTableFunction {
    private n: number

    constructor(columnIndex: number, sourceColumnIndex: number, n: number) {
        super(columnIndex, sourceColumnIndex)
        this.n = n
    }

    override calculate(data: any[][]): number {
        const columnData = this.sourceColumn(data)
        const start = this.getStart(data, this.n)
        let sum = 0
        for (let i = start; i < columnData.length; i++) sum += columnData[i]
        return sum / Math.min(columnData.length, this.n)
    }
}