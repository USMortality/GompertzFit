import { ArithmeticFunction } from './../src/table/arithmeticTableFunction.js'
import {
  ArithmeticTableRowType,
  GompertzJtS1TableRowType,
  GompertzJtS2TableRowType,
  GompertzJtS3TableRowType,
  GompertzTableRowType
} from './../src/table/tableRowType.js'
import { LocalExtramaType } from './../src/table/localExtremaTableFunction.js'
import {
  AutoIncrementTableRowType,
  AvgNTableRowType,
  AvgTableRowType,
  DiffTableRowType,
  GaussTableRowType,
  LocalExtremaTableRowType,
  LoessTableRowType,
  StaticTableRowType,
  SumNTableRowType,
  SumTableRowType
} from '../src/table/tableRowType.js'
import { DataType, Table } from '../src/table/table.js'
import { expect } from 'chai'
import { fillerDateArray } from '../src/common.js'

const rows = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  [70, 30, 78, 81, 66, 43, 31, 48, 93, 56, 91, 25, 19, 17],
]

describe('table', () => {
  it('create new table', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'),
        new StaticTableRowType('Cases'),
        new SumTableRowType('Cases Sum', 1)
      ]
    )
    expect(table.data.length).to.equal(3)
    ensureEqualColumnLength(table.data)
  })

  it('insert rows', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'),
        new StaticTableRowType('Cases'),
        new SumTableRowType('Cases Sum', 1),
        new SumNTableRowType('Cases Sum', 1, 7)
      ]
    )
    table.insertRow([1, 0])
    table.insertRow([2, 2])
    table.insertRow([3, 7])
    table.insertRow([4, 3])
    table.insertRow([5, 11])

    expect(table.data.length).to.equal(4)
    expect(table.data[0].length).to.equal(5)
    expect(table.data[1][4]).to.equal(11)
    ensureEqualColumnLength(table.data)
  })

  it('insertRows', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'),
        new StaticTableRowType('Cases'),
        new SumTableRowType('Cases Sum', 1),
        new SumNTableRowType('Cases Sum', 1, 7)
      ]
    )
    table.insertRows([
      [1, 2, 3, 4, 5, 6, 7],
      [10, 13, 7, 8, 11, 15, 18]
    ])
    table.insertRows([
      [8, 9, 10, 11, 12, 13, 14],
      [10, 13, 7, 8, 11, 15, 18]
    ])

    expect(table.data.length).to.equal(4)
    expect(table.data[0].length).to.equal(14)
    expect(table.data[1][6]).to.equal(18)
    ensureEqualColumnLength(table.data)
  })

  it('sumFunction', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'),
        new StaticTableRowType('Cases'),
        new SumTableRowType('Cases Sum', 1)
      ]
    )
    table.insertRows(rows)

    expect(table.data[2][13]).to.equal(748)
    ensureEqualColumnLength(table.data)
  })

  it('sumNFunction', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'),
        new StaticTableRowType('Cases'),
        new SumNTableRowType('Cases Sum', 1, 7)
      ]
    )
    table.insertRows(rows)

    expect(table.data[2][13]).to.equal(349)
    ensureEqualColumnLength(table.data)
  })

  it('loessFunction', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'),
        new StaticTableRowType('Cases'),
        new AvgNTableRowType('Cases 7d Avg', 1, 7),
        new LoessTableRowType('Cases 7day Avg (Smooth)', 2, 0, 2 / 3)
      ]
    )
    table.insertRows(rows)

    expect(table.data[2][13]).to.equal(49.857142857142854)
    expect(table.data[3][11]).to.equal(55.13355093120387)
    ensureEqualColumnLength(table.data)
  })

  it('gaussFunction_min', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'),
        new GaussTableRowType('Cases 7d Avg (Smooth)', 0, 1)
      ]
    )
    table.insertRows([[0]])
    expect(table.data[0][0]).to.equal(0)
    expect(table.data[1].length).to.equal(1)
    table.insertRows([[0]])
    expect(table.data[0][0]).to.equal(0)
    expect(table.data[1].length).to.equal(2)
    ensureEqualColumnLength(table.data)
  })

  it('gaussFunction', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'),
        new StaticTableRowType('Cases'),
        new AvgNTableRowType('Cases 7d Avg', 1, 7),
        new GaussTableRowType('Cases 7d Avg (Smooth)', 2, 1)
      ]
    )
    table.insertRows(rows)

    expect(table.data[2][11]).to.equal(55.285714285714285)
    expect(table.data[3][11]).to.equal(55.37773153875938)
    ensureEqualColumnLength(table.data)
  })

  it('autoIncrementFunction', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'),
        new StaticTableRowType('Cases'),
        new AutoIncrementTableRowType('t')
      ]
    )
    table.insertRows(rows)
    expect(table.data[0]).to.eql(table.data[2])
    ensureEqualColumnLength(table.data)
  })

  it('avgFunction', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'),
        new StaticTableRowType('Cases'),
        new AvgTableRowType('t', 1)
      ]
    )
    table.insertRows(rows)
    expect(table.data[2][9]).to.equal(59.6)
    ensureEqualColumnLength(table.data)
  })

  it('avgNFunction', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'),
        new StaticTableRowType('Cases'),
        new AvgNTableRowType('t', 1, 7)
      ]
    )
    table.insertRows(rows)

    expect(table.data[2][13]).to.equal(49.857142857142854)
    ensureEqualColumnLength(table.data)
  })

  it('diffFunction', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'),
        new StaticTableRowType('Cases'),
        new DiffTableRowType('diff', 0)
      ]
    )
    table.insertRows(rows)
    expect(table.data[2]).to.eql(
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    )
    ensureEqualColumnLength(table.data)
  })

  it('gompertzFunction', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'),
        new StaticTableRowType('Cases'),
        new AutoIncrementTableRowType('t'),
        new GompertzTableRowType('Gompertz', 1, 2)
      ]
    )
    table.insertRows(rows)
    expect(table.data[3]).to.eql(
      [
        32.83417484339624,
        36.15897879571348,
        39.72873491515909,
        43.55235817230494,
        47.638317197567005,
        51.994570957488186,
        56.62850704060756,
        61.54688210014856,
        66.75576498066528,
        72.26048302956409,
        78.06557206255519,
        84.17473041515238,
        90.59077747095303,
        97.31561701226438
      ]
    )
    ensureEqualColumnLength(table.data)
  })

  it('localExtremaFunction, min', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'),
        new StaticTableRowType('Cases'),
        new LocalExtremaTableRowType('min', 1, LocalExtramaType.MIN)
      ]
    )
    table.insertRows(rows)
    // [70, 30, 78, 81, 66, 43, 31, 48, 93, 56, 91, 25, 19, 17,],

    expect(table.data[2]).to.eql(
      [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0]
    )
    ensureEqualColumnLength(table.data)
  })

  it('localExtremaFunction, max', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'),
        new StaticTableRowType('Cases'),
        new LocalExtremaTableRowType('max', 1, LocalExtramaType.MAX)
      ]
    )
    table.insertRows(rows)

    expect(table.data[2]).to.eql(
      [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0]
    )
    ensureEqualColumnLength(table.data)
  })

  it('arithmeticFunction, max', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'),
        new StaticTableRowType('Cases'),
        new ArithmeticTableRowType('Cases -BG', 0,
          ArithmeticFunction.SUB, 0, 0)
      ]
    )
    table.insertRows(rows)

    expect(table.data[2]).to.eql(
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    )
    ensureEqualColumnLength(table.data)
  })

  it('real example', () => {
    const table = new Table(
      [
        new StaticTableRowType('Date'),
        new StaticTableRowType('Cumulative Cases'),
        new AutoIncrementTableRowType('t'),
        new DiffTableRowType('Daily Cases', 1),
        new AvgNTableRowType('Cases (7d AVG)', 3, 7),
        new LoessTableRowType('Cases (7d AVG, smooth)', 4, 2, 2 / 3)
      ]
    )
    table.insertRows([
      [
        new Date(2022, 1, 1),
        new Date(2022, 1, 2),
        new Date(2022, 1, 3),
        new Date(2022, 1, 4),
        new Date(2022, 1, 5),
        new Date(2022, 1, 6),
        new Date(2022, 1, 7),
        new Date(2022, 1, 8),
        new Date(2022, 1, 9),
        new Date(2022, 1, 10),
        new Date(2022, 1, 11),
        new Date(2022, 1, 12),
        new Date(2022, 1, 13),
        new Date(2022, 1, 14)
      ],
      [
        11769282,
        11970948,
        12150766,
        12297353,
        12478864,
        12652425,
        12832636,
        12949885,
        13164520,
        13332743,
        13473088,
        13628002,
        13825118,
        14021279
      ]
    ])

    expect(table.data[3][13]).to.equal(196161)
    expect(table.data[4][13]).to.equal(169806.14285714287)
    expect(table.data[5][13]).to.equal(168421.3794513356)
    ensureEqualColumnLength(table.data)
  })

  it('splitAt, max', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'),
        new StaticTableRowType('Cases'),
        new LocalExtremaTableRowType('min', 1, LocalExtramaType.MIN)
      ]
    )
    table.insertRows(rows)
    const splitTable = table.splitAt(2, 1)

    expect(splitTable).to.eql(
      [
        [[1], [70], [0]],
        [[2, 3, 4, 5, 6], [30, 78, 81, 66, 43], [1, 0, 0, 0, 0]],
        [[7, 8, 9], [31, 48, 93], [1, 0, 0]],
        [[10, 11, 12, 13], [56, 91, 25, 19], [1, 0, 0, 0]]
      ]
    )

    const subTable = new Table([
      new StaticTableRowType('t'),
      new StaticTableRowType('Cases')
    ])
    const subData = splitTable[splitTable.length - 1]
    subTable.insertRows(subData.slice(0, -1))
    expect(subTable.data).to.eql(
      [[10, 11, 12, 13], [56, 91, 25, 19]]
    )
    ensureEqualColumnLength(table.data)
  })

  it('extendColumn', () => {
    const table = new Table(
      [
        new StaticTableRowType('date'),
        new StaticTableRowType('Cases'),
      ]
    )
    table.insertRows([[new Date()], [1]])
    const extender = fillerDateArray(new Date(), 2)
    table.extendColumn(0, extender)
    expect(table.data[0].length).to.equal(3)
    expect(table.data[1].length).to.equal(1)
  })

  it('reduceColumn', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'),
        new StaticTableRowType('Cases'),
      ]
    )
    table.insertRows(rows)
    table.reduceColumn(0, 10)
    expect(table.data[0].length).to.equal(4)
    expect(table.data[0]).to.eql([1, 2, 3, 4])
  })

  it('gompertzJtS1TableRowType', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'),
        new StaticTableRowType('cases cumulative'),
        new GompertzJtS1TableRowType('Growth Line', 1)
      ]
    )
    table.insertRows([
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      [4, 11, 24, 43, 78, 136, 218, 358, 526, 663, 896, 1136, 1551],
    ])
    expect(table.data[2]).to.eql(
      [
        0,
        0.00500921206892179,
        -0.10781712337255546,
        -0.23422248649452965,
        -0.22511188135192114,
        -0.2549673440202925,
        -0.32620508182783464,
        -0.3044851191032519,
        -0.414800798630711,
        -0.6354982009942258,
        -0.5211948915480892,
        -0.6246506796912439,
        -0.5067001308557559
      ]
    )
  })

  it('gompertzJtS2TableRowType', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'), // 0
        new StaticTableRowType('cases cumulative'), // 1
        new GompertzJtS1TableRowType('Growth Line', 1), // 2
        new AutoIncrementTableRowType('x', 7), // 3
        new GompertzJtS2TableRowType('Growth Line Trend', 2, 3, 7) // 4
      ]
    )
    table.insertRows([
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      [4, 11, 24, 43, 78, 136, 218, 358, 526, 663, 896, 1136, 1551],
    ])
    expect(table.data[4]).to.eql(
      [
        -0.10815916861383676,
        -0.15416668151301988,
        -0.20017419441220302,
        -0.24618170731138614,
        -0.29218922021056926,
        -0.3381967331097524,
        -0.3842042460089355,
        -0.43021175890811864,
        -0.4762192718073018,
        -0.5222267847064849,
        -0.568234297605668,
        -0.6142418105048512,
        -0.6602493234040343,
        -0.7062568363032173,
        -0.7522643492024005,
        -0.7982718621015836,
        -0.8442793750007668,
        -0.8902868878999499,
        -0.936294400799133,
        -0.9823019136983161,
      ]
    )
  })

  it('gompertzJtS3TableRowType', () => {
    const table = new Table(
      [
        new StaticTableRowType('t'), // 0
        new StaticTableRowType('cases cumulative'), // 1
        new AutoIncrementTableRowType('x', 7), // 2
        new GompertzJtS1TableRowType('Growth Line', 1), // 3
        new GompertzJtS2TableRowType('Growth Line Trend', 3, 2, 7), // 4
        new GompertzJtS3TableRowType('Prediction Total', 1, 2, 4) // 5
      ]
    )
    table.insertRows([
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      [4, 11, 24, 43, 78, 136, 218, 358, 526, 663, 896, 1136, 1551],
    ])
    expect(table.data[5].length).to.equal(20)
  })

  function ensureEqualColumnLength(data: DataType[]): void {
    for (const row of data) {
      expect(row.length).to.equal(data[0].length)
    }
  }
})
