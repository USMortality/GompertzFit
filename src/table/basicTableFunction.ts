export interface TableFunction {
    calculate(data: any[][]): number
}

export abstract class BasicTableFunction implements TableFunction {
    targetColumnIndex: number

    constructor(targetColumnIndex) {
        this.targetColumnIndex = targetColumnIndex
    }

    abstract calculate(data: any[][]): number
}
