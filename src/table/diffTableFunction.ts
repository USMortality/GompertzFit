import { fillerArray } from '../common.js'
import { BasicTableFunction } from './basicTableFunction.js'

export class DiffTableFunction extends BasicTableFunction {
    override calculate(data: any[][]): number[] {
        const result = [0]
        const columnData = this.sourceColumn(data)

        for (let i = 1; i < columnData.length; i++) {
            result.push(columnData[i] - columnData[i - 1])
        }
        return result
    }
}