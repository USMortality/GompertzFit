export interface TableFunction {
    calculate(data: any[][]): number
}

export abstract class BasicTableFunction implements TableFunction {
    columnIndex: number
    sourceColumnIndex: number

    constructor(columnIndex: number, sourceColumnIndex: number) {
        this.columnIndex = columnIndex
        this.sourceColumnIndex = sourceColumnIndex
    }

    abstract calculate(data: any[][]): number

    lastTargetElement(data: any[][]): number {
        const targetRow = this.targetRow(data)
        return targetRow.length > 0 ? targetRow[targetRow.length - 1] : 0
    }

    lastSourceElement(data: any[][]): number {
        const sourceRow = this.sourceRow(data)
        return sourceRow[sourceRow.length - 1]
    }

    targetRow(data: any[][]): any[] {
        return data[this.columnIndex]
    }

    sourceRow(data: any[][]): any[] {
        return data[this.sourceColumnIndex]
    }
}
