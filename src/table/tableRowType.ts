import { ArithmeticFunction, ArithmeticTableFunction } from './arithmeticTableFunction'
import { LocalExtramaType } from './localExtremaTableFunction'
export abstract class TableRowType {
    title: string
    constructor(title: string) {
        this.title = title
    }
}

// tslint:disable-next-line: max-classes-per-file
export class StaticTableRowType extends TableRowType { }

// tslint:disable-next-line: max-classes-per-file
export class DateTableRowType extends StaticTableRowType { }

// tslint:disable-next-line: max-classes-per-file
export abstract class FunctionalTableRowType extends TableRowType {
    sourceColumnIndex: number
    constructor(title: string, sourceColumnIndex?: number) {
        super(title)
        this.sourceColumnIndex = sourceColumnIndex
    }
}

// tslint:disable-next-line: max-classes-per-file
export class AutoIncrementTableRowType extends FunctionalTableRowType {
    extraRows: number
    constructor(title: string, extraRows: number = 0) {
        super(title)
        this.extraRows = extraRows
    }
}

// tslint:disable-next-line: max-classes-per-file
export class SumTableRowType extends FunctionalTableRowType { }

// tslint:disable-next-line: max-classes-per-file
export class SumNTableRowType extends FunctionalTableRowType {
    n: number
    constructor(title: string, sourceColumnIndex: number, n: number) {
        super(title, sourceColumnIndex)
        this.n = n
    }
}

// tslint:disable-next-line: max-classes-per-file
export class AvgTableRowType extends FunctionalTableRowType { }

// tslint:disable-next-line: max-classes-per-file
export class AvgNTableRowType extends FunctionalTableRowType {
    n: number
    constructor(title: string, sourceColumnIndex: number, n: number) {
        super(title, sourceColumnIndex)
        this.n = n
    }
}

// tslint:disable-next-line: max-classes-per-file
export class LoessTableRowType extends FunctionalTableRowType {
    xColumnIndex: number
    constructor(
        title: string,
        sourceColumnIndex: number,
        xColumnIndex: number
    ) {
        super(title, sourceColumnIndex)
        this.xColumnIndex = xColumnIndex
    }
}

// tslint:disable-next-line: max-classes-per-file
export class DiffTableRowType extends FunctionalTableRowType { }

// tslint:disable-next-line: max-classes-per-file
export class GaussTableRowType extends FunctionalTableRowType {
    iterations: number
    constructor(
        title: string,
        sourceColumnIndex: number,
        iterations: number
    ) {
        super(title, sourceColumnIndex)
        this.iterations = iterations
    }
}

// tslint:disable-next-line: max-classes-per-file
export class LocalExtremaTableRowType extends FunctionalTableRowType {
    type: LocalExtramaType
    constructor(
        title: string,
        sourceColumnIndex: number,
        type: LocalExtramaType
    ) {
        super(title, sourceColumnIndex)
        this.type = type
    }
}

// tslint:disable-next-line: max-classes-per-file
export class GompertzTableRowType extends FunctionalTableRowType {
    tColumnIndex: number
    constructor(
        title: string,
        sourceColumnIndex: number,
        tColumnIndex: number
    ) {
        super(title, sourceColumnIndex)
        this.tColumnIndex = tColumnIndex
    }
}

// tslint:disable-next-line: max-classes-per-file
export class ArithmeticTableRowType extends FunctionalTableRowType {
    arithmeticFunction: ArithmeticFunction
    termColumnIndex: number
    termRowIndex: number

    constructor(
        title: string,
        sourceColumnIndex: number,
        arithmeticFunction: ArithmeticFunction,
        termColumnIndex: number,
        termRowIndex: number
    ) {
        super(title, sourceColumnIndex)
        this.arithmeticFunction = arithmeticFunction
        this.termColumnIndex = termColumnIndex
        this.termRowIndex = termRowIndex
    }
}
