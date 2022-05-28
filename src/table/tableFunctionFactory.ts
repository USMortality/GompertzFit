import { LoessTableFunction } from './loessTableFunction.js'
import { TableFunction } from './basicTableFunction.js'
import { SumTableFunction } from './sumTableFunction.js'
import { SumNTableFunction } from './sumNTableFunction.js'
import {
  ArithmeticTableRowType,
  AutoIncrementTableRowType,
  AvgNTableRowType,
  AvgTableRowType,
  BasicFunctionalTableRowType,
  DiffTableRowType,
  FunctionalTableRowType,
  GaussTableRowType,
  GompertzJtS1TableRowType,
  GompertzJtS2TableRowType,
  GompertzJtS3TableRowType,
  GompertzTableRowType,
  LocalExtremaTableRowType,
  LoessTableRowType,
  SumNTableRowType,
  SumTableRowType
} from './tableRowType.js'
import { AutoIncrementTableFunction } from './autoIncrementTableFunction.js'
import { AvgTableFunction } from './avgTableFunction.js'
import { AvgNTableFunction } from './avgNTableFunction.js'
import { DiffTableFunction } from './diffTableFunction.js'
import { GaussTableFunction } from './gaussTableFunction.js'
import { LocalExtremaTableFunction } from './localExtremaTableFunction.js'
import { GompertzTableFunction } from './gompertzTableFunction.js'
import { ArithmeticTableFunction } from './arithmeticTableFunction.js'
import { GompertzJtS1TableFunction } from './gompertzJtS1TableFunction.js'
import { GompertzJtS2TableFunction } from './gompertzJtS2TableFunction.js'
import { GompertzJtS3TableFunction } from './gompertzJtS3TableFunction.js'

export class TableFunctionFactory {
  static getFunction(
    columnIndex: number,
    basicFunctionalTableRowType: BasicFunctionalTableRowType
  ): TableFunction {
    const functionalTableRowType =
      basicFunctionalTableRowType as FunctionalTableRowType

    switch (basicFunctionalTableRowType.constructor) {
      case SumTableRowType:
        return new SumTableFunction(
          columnIndex,
          functionalTableRowType.sourceColumnIndex
        )
      case SumNTableRowType:
        const sumNTableRowType =
          basicFunctionalTableRowType as SumNTableRowType
        return new SumNTableFunction(
          columnIndex,
          sumNTableRowType.sourceColumnIndex,
          sumNTableRowType.n
        )
      case LoessTableRowType:
        const loessTableRowType =
          basicFunctionalTableRowType as LoessTableRowType
        return new LoessTableFunction(
          columnIndex,
          loessTableRowType.sourceColumnIndex,
          loessTableRowType.xColumnIndex
        )
      case GaussTableRowType:
        const gaussTableRowType
          = basicFunctionalTableRowType as GaussTableRowType
        return new GaussTableFunction(
          columnIndex,
          gaussTableRowType.sourceColumnIndex,
          gaussTableRowType.iterations
        )
      case AutoIncrementTableRowType:
        const autoIncrementTableRowType
          = basicFunctionalTableRowType as AutoIncrementTableRowType
        return new AutoIncrementTableFunction(
          autoIncrementTableRowType.extraRows
        )
      case AvgTableRowType:
        return new AvgTableFunction(
          columnIndex,
          functionalTableRowType.sourceColumnIndex
        )
      case AvgNTableRowType:
        const avgNTableRowType =
          basicFunctionalTableRowType as AvgNTableRowType
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
      case LocalExtremaTableRowType:
        const localExtremaTableRowType =
          basicFunctionalTableRowType as LocalExtremaTableRowType
        return new LocalExtremaTableFunction(
          columnIndex,
          localExtremaTableRowType.sourceColumnIndex,
          localExtremaTableRowType.type
        )
      case GompertzTableRowType:
        const gompertzTableRowType =
          basicFunctionalTableRowType as GompertzTableRowType
        return new GompertzTableFunction(
          columnIndex,
          gompertzTableRowType.sourceColumnIndex,
          gompertzTableRowType.tColumnIndex
        )
      case ArithmeticTableRowType:
        const addTableRowType =
          basicFunctionalTableRowType as ArithmeticTableRowType
        return new ArithmeticTableFunction(
          columnIndex,
          addTableRowType.sourceColumnIndex,
          addTableRowType.arithmeticFunction,
          addTableRowType.termColumnIndex,
          addTableRowType.termRowIndex,
        )
      case GompertzJtS1TableRowType:
        return new GompertzJtS1TableFunction(
          columnIndex,
          functionalTableRowType.sourceColumnIndex
        )
      case GompertzJtS2TableRowType:
        const gompertzJt2TableRowType =
          basicFunctionalTableRowType as GompertzJtS2TableRowType
        return new GompertzJtS2TableFunction(
          columnIndex,
          gompertzJt2TableRowType.sourceColumnIndex,
          gompertzJt2TableRowType.xColumnIndex,
          gompertzJt2TableRowType.days
        )
      case GompertzJtS3TableRowType:
        const gompertzJt3TableRowType =
          basicFunctionalTableRowType as GompertzJtS3TableRowType
        return new GompertzJtS3TableFunction(
          columnIndex,
          functionalTableRowType.sourceColumnIndex,
          gompertzJt3TableRowType.xColumnIndex,
          gompertzJt3TableRowType.s2ColumnIndex
        )
      default: throw new Error('Requested table function not defined.')
    }
  }
}
