import { LoessTableFunction } from './loessTableFunction.js'
import { TableFunction } from './basicTableFunction.js'
import { SumTableFunction } from './sumTableFunction.js'
import { SumNTableFunction } from './sumNTableFunction.js'
import {
    AutoIncrementTableRowType,
    AvgNTableRowType,
    AvgTableRowType,
    DiffTableRowType,
    FunctionalTableRowType,
    GaussTableRowType,
    LocalMinTableRowType,
    LoessTableRowType,
    SumNTableRowType,
    SumTableRowType
} from './tableRowType.js'
import { AutoIncrementTableFunction } from './autoIncrementTableFunction.js'
import { AvgTableFunction } from './avgTableFunction.js'
import { AvgNTableFunction } from './avgNTableFunction.js'
import { DiffTableFunction } from './diffTableFunction.js'
import { GaussTableFunction } from './gaussTableFunction.js'
import { LocalMinTableFunction } from './localMinTableFunction.js'

export class TableFunctionFactory {
    static getFunction(
        columnIndex: number,
        functionalTableRowType: FunctionalTableRowType
    ): TableFunction {
        switch (functionalTableRowType.constructor) {
            case SumTableRowType:
                return new SumTableFunction(
                    columnIndex,
                    functionalTableRowType.sourceColumnIndex
                )
            case SumNTableRowType:
                const sumNTableRowType =
                    functionalTableRowType as SumNTableRowType
                return new SumNTableFunction(
                    columnIndex,
                    sumNTableRowType.sourceColumnIndex,
                    sumNTableRowType.n
                )
            case LoessTableRowType:
                const loessTableRowType
                    = functionalTableRowType as LoessTableRowType
                return new LoessTableFunction(
                    columnIndex,
                    loessTableRowType.sourceColumnIndex,
                    loessTableRowType.xColumnIndex
                )
            case GaussTableRowType:
                const gaussTableRowType
                    = functionalTableRowType as GaussTableRowType
                return new GaussTableFunction(
                    columnIndex,
                    gaussTableRowType.sourceColumnIndex,
                    gaussTableRowType.iterations
                )
            case AutoIncrementTableRowType:
                return new AutoIncrementTableFunction(
                    columnIndex,
                    functionalTableRowType.sourceColumnIndex
                )
            case AvgTableRowType:
                return new AvgTableFunction(
                    columnIndex,
                    functionalTableRowType.sourceColumnIndex
                )
            case AvgNTableRowType:
                const avgNTableRowType
                    = functionalTableRowType as AvgNTableRowType
                return new AvgNTableFunction(
                    columnIndex,
                    avgNTableRowType.sourceColumnIndex,
                    avgNTableRowType.n
                )
            case DiffTableRowType:
                return new DiffTableFunction(
                    columnIndex,
                    functionalTableRowType.sourceColumnIndex
                )
            case LocalMinTableRowType:
                return new LocalMinTableFunction(
                    columnIndex,
                    functionalTableRowType.sourceColumnIndex
                )
            default: throw new Error('Requested table function not defined.')
        }
    }
}
