import { getSmoothedArrayMulti } from 'gauss-window'
import { BasicTableFunction } from './basicTableFunction.js'

export class GaussTableFunction extends BasicTableFunction {
    iterations: number

    constructor(
        columnIndex: number,
        sourceColumnIndex: number,
        iterations: number) {
        super(columnIndex, sourceColumnIndex)
        this.iterations = iterations
    }

    override calculate(data: any[][]): number | number[] {
        const sourceColumn = this.sourceColumn(data)
        return getSmoothedArrayMulti(sourceColumn, this.iterations, 5, 1, false)
    }
}