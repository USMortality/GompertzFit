import assert from 'assert'
import { BasicTableFunction } from './basicTableFunction.js'

export enum LocalExtramaType { MIN, MAX }

export class LocalExtremaTableFunction extends BasicTableFunction {
    type: LocalExtramaType

    constructor(
        columnIndex: number,
        sourceColumnIndex: number,
        type: LocalExtramaType
    ) {
        super(columnIndex, sourceColumnIndex)
        this.type = type
    }

    override calculate(data: any[][]): number | number[] {
        const sourceColumn = this.sourceColumn(data)
        const len = sourceColumn.length
        if (len < 3) return 0

        const result = [0]
        for (let i = 2; i < sourceColumn.length; i++) {
            const prev = sourceColumn[i - 2]
            const curr = sourceColumn[i - 1]
            const next = sourceColumn[i]

            switch (this.type) {
                case LocalExtramaType.MAX:
                    result.push((prev <= curr && curr >= next) ? 1 : 0)
                    break
                case LocalExtramaType.MIN:
                    result.push((prev >= curr && curr <= next) ? 1 : 0)
                    break
            }
        }
        result.push(0)

        assert(
            result.length === len,
            new Error('LocalMaxTableFunction: Different length')
        )
        return result
    }
}