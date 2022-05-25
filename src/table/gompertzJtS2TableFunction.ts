import { BasicTableFunction } from './basicTableFunction.js'
import SimpleLinearRegression from 'ml-regression-simple-linear'

export class GompertzJtS2TableFunction extends BasicTableFunction {
    xColumnIndex: number
    days: number

    constructor(
        columnIndex: number,
        sourceColumnIndex: number,
        xColumnIndex: number,
        days: number
    ) {
        super(columnIndex, sourceColumnIndex)
        this.xColumnIndex = xColumnIndex
        this.days = days
    }

    override calculate(data: any[][]): number[] {
        const columnData = this.sourceColumn(data)
        const xData = this.makeXRow(columnData.length)
        const result = []

        // Calculate log[Exp. Grow. Factor] Trend Line
        const regression = new SimpleLinearRegression(
            xData.slice(-this.days),
            columnData.slice(-this.days)
        )

        // Calculate Predicted Growth
        const xColumn = data[this.xColumnIndex]
        for (const x of xColumn) {
            result.push(regression.slope * x + regression.intercept)
        }

        return result
    }

    private makeXRow(len: number): number[] {
        const result = []
        for (let i = 0; i < len; i++) result.push(i)
        return result
    }
}
