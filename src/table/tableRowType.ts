import { ArithmeticFunction } from './arithmeticTableFunction'
import { LocalExtramaType } from './localExtremaTableFunction.js'
export abstract class TableRowType {
  title: string
  constructor(title: string) {
    this.title = title
  }
}

// eslint-disable-next-line max-classes-per-file
export class StaticTableRowType extends TableRowType { }

// eslint-disable-next-line max-classes-per-file
export class DateTableRowType extends StaticTableRowType { }

// eslint-disable-next-line max-classes-per-file
export abstract class BasicFunctionalTableRowType extends TableRowType { }

// eslint-disable-next-line max-classes-per-file
export abstract class FunctionalTableRowType
  extends BasicFunctionalTableRowType {
  sourceColumnIndex: number
  constructor(title: string, sourceColumnIndex: number) {
    super(title)
    this.sourceColumnIndex = sourceColumnIndex
  }
}

// eslint-disable-next-line max-classes-per-file
export class AutoIncrementTableRowType extends BasicFunctionalTableRowType {
  extraRows: number
  constructor(title: string, extraRows = 0) {
    super(title)
    this.extraRows = extraRows
  }
}

// eslint-disable-next-line max-classes-per-file
export class SumTableRowType extends FunctionalTableRowType { }

// eslint-disable-next-line max-classes-per-file
export class SumNTableRowType extends FunctionalTableRowType {
  n: number
  constructor(title: string, sourceColumnIndex: number, n: number) {
    super(title, sourceColumnIndex)
    this.n = n
  }
}

// eslint-disable-next-line max-classes-per-file
export class AvgTableRowType extends FunctionalTableRowType { }

// eslint-disable-next-line max-classes-per-file
export class AvgNTableRowType extends FunctionalTableRowType {
  n: number
  constructor(title: string, sourceColumnIndex: number, n: number) {
    super(title, sourceColumnIndex)
    this.n = n
  }
}

// eslint-disable-next-line max-classes-per-file
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

// eslint-disable-next-line max-classes-per-file
export class DiffTableRowType extends FunctionalTableRowType { }

// eslint-disable-next-line max-classes-per-file
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

// eslint-disable-next-line max-classes-per-file
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

// eslint-disable-next-line max-classes-per-file
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

// eslint-disable-next-line max-classes-per-file
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

// eslint-disable-next-line max-classes-per-file
export class GompertzJtS1TableRowType extends FunctionalTableRowType { }

// eslint-disable-next-line max-classes-per-file
export class GompertzJtS2TableRowType extends FunctionalTableRowType {
  xColumnIndex: number
  days: number
  constructor(
    title: string,
    sourceColumnIndex: number,
    xColumnIndex: number,
    days: number,
  ) {
    super(title, sourceColumnIndex)
    this.xColumnIndex = xColumnIndex
    this.days = days
  }
}

// eslint-disable-next-line max-classes-per-file
export class GompertzJtS3TableRowType extends FunctionalTableRowType {
  xColumnIndex: number
  s2ColumnIndex: number

  constructor(
    title: string,
    sourceColumnIndex: number,
    xColumnIndex: number,
    s2ColumnIndex: number,
  ) {
    super(title, sourceColumnIndex)
    this.xColumnIndex = xColumnIndex
    this.s2ColumnIndex = s2ColumnIndex
  }
}
