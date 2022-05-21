import { LoessTableFunction } from './loessTableFunction'
import { TableFunction } from './basicTableFunction'
import { SumTableFunction } from './sumTableFunction'
import { SumNTableFunction } from './sumNTableFunction'

export type TableFunctionDefinition = {
    tableFunctionType: TableFunctionType,
    targetColumnIndex: number
}

export enum TableFunctionType {
    Sum,
    Sum7,
    Loess
}

export class TableFunctionFactory {
    static getFunction(
        tableFunctionDefinition: TableFunctionDefinition
    ): TableFunction {
        switch (tableFunctionDefinition.tableFunctionType) {
            case TableFunctionType.Sum: {
                return new SumTableFunction(
                    tableFunctionDefinition.targetColumnIndex
                )
            }
            case TableFunctionType.Sum7: {
                return new SumNTableFunction(
                    tableFunctionDefinition.targetColumnIndex, 7
                )
            }
            case TableFunctionType.Loess: {
                return new LoessTableFunction(
                    tableFunctionDefinition.targetColumnIndex
                )
            }
        }
    }
}
