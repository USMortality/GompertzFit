import { LoessTableFunction } from './loessTableFunction.js'
import { TableFunction } from './basicTableFunction.js'
import { SumTableFunction } from './sumTableFunction.js'
import { SumNTableFunction } from './sumNTableFunction.js'
import {
    FunctionalTableRowType, LoessTableRowType, SumNTableRowType, SumTableRowType
} from './tableRowType.js'

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
        }
    }
}
