import { LoessTableFunction } from './loessTableFunction'
import { TableFunction } from './basicTableFunction'
import { SumTableFunction } from './sumTableFunction'
import { SumNTableFunction } from './sumNTableFunction'

export type TableFunctionDefinition = {
    tableFunctionType: TableFunctionType,
    sourceColumnIndex: number
}

export enum TableFunctionType {
    Sum,
    Sum7,
    Loess
}

export class TableFunctionFactory {
    static getFunction(
        columnIndex: number,
        tableFunctionDefinition: TableFunctionDefinition
    ): TableFunction {
        switch (tableFunctionDefinition.tableFunctionType) {
            case TableFunctionType.Sum: {
                return new SumTableFunction(
                    columnIndex,
                    tableFunctionDefinition.sourceColumnIndex
                )
            }
            case TableFunctionType.Sum7: {
                return new SumNTableFunction(
                    columnIndex,
                    tableFunctionDefinition.sourceColumnIndex, 7
                )
            }
            case TableFunctionType.Loess: {
                return new LoessTableFunction(
                    columnIndex,
                    tableFunctionDefinition.sourceColumnIndex
                )
            }
        }
    }
}