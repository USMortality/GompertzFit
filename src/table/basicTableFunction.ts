export interface TableFunction {
    calculate(data: any[][]): number | number[]
}

export abstract class BasicTableFunction implements TableFunction {
    columnIndex: number
    sourceColumnIndex: number

    constructor(
        columnIndex: number,
        sourceColumnIndex: number
    ) {
        this.columnIndex = columnIndex
        this.sourceColumnIndex = sourceColumnIndex
    }

    // TODO: Remove `number` type, not stable with e.g. gauss functions.
    abstract calculate(data: any[][]): number | number[]

    lastTargetElement(data: any[][]): number {
        const targetRow = this.targetColumn(data)
        return targetRow.length > 0 ? targetRow[targetRow.length - 1] : 0
    }

    lastSourceElement(data: any[][]): number {
        const sourceRow = this.sourceColumn(data)
        return sourceRow[sourceRow.length - 1]
    }

    targetColumn(data: any[][]): any[] {
        return data[this.columnIndex]
    }

    sourceColumn(data: any[][]): any[] {
        return data[this.sourceColumnIndex]
    }

    getStart(data: any[][], n: number): number {
        const columnData = this.sourceColumn(data)
        return columnData.length < n ? 0 : columnData.length - n
    }
}
