import { BasicTableFunction } from './basicTableFunction'

export class SumNTableFunction extends BasicTableFunction {
    private n: number

    constructor(columnIndex: number, sourceColumnIndex: number, n: number) {
        super(columnIndex, sourceColumnIndex)
        this.n = n
    }

    override calculate(data: any[][]): number {
        const colIndex = 1
        const columnData = data[colIndex]
        const start: number = columnData.length < this.n ?
            0 : columnData.length - this.n
        let sum = 0
        for (let i = start; i < columnData.length; i++) {
            sum += columnData[i]
        }
        return sum as any
    }
}