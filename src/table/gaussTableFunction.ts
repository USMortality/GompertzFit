import { getSmoothedArray, getSmoothedArrayMulti } from 'gauss-window'
import { BasicTableFunction } from './basicTableFunction.js'

export class GaussTableFunction extends BasicTableFunction {
    override calculate(data: any[][]): number | number[] {
        const sourceColumn = this.sourceColumn(data)
        return getSmoothedArrayMulti(sourceColumn, 10, 5, 1, false)
    }
}