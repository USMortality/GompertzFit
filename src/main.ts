import { execSync } from 'child_process'
import { LocalExtramaType } from './table/localExtremaTableFunction.js'
import {
  TwitterChart,
  TwitterChartSeriesAxisType,
  TwitterChartSeriesConfigType
} from './twitterChart.js'
import { DataLoader, Row } from './dataLoader.js'
import { Table } from './table/table.js'
import {
  AutoIncrementTableRowType,
  AvgNTableRowType,
  DiffTableRowType,
  StaticTableRowType,
  GaussTableRowType,
  LocalExtremaTableRowType,
  GompertzTableRowType,
  ArithmeticTableRowType,
  SumTableRowType,
  GompertzJtS1TableRowType,
  GompertzJtS2TableRowType,
  GompertzJtS3TableRowType,
  LoessTableRowType,
} from './table/tableRowType.js'
import {
  dateString,
  fillerDateArray,
  getNameFromKey,
  numberWithCommas,
  zeroPad
} from './common.js'
import { ArithmeticFunction } from './table/arithmeticTableFunction.js'
import { ensureDir } from 'fs-extra'

class Runner {
  jurisdiction = 'united_states'
  data: Map<string, Row[]>
  extraDays = 120
  folder = 'test'
  table: Table = new Table(
    [
      new StaticTableRowType('Date'), // 0
      new StaticTableRowType('Cumulative Cases'), // 1
      new AutoIncrementTableRowType('Day'), // 2
      new DiffTableRowType('Daily Cases', 1), // 3
      new AvgNTableRowType('Cases (7d AVG)', 3, 7), // 4
      new GaussTableRowType('Cases (7d AVG, smooth)', 4, 100), // 5
      new LocalExtremaTableRowType('Min', 5, LocalExtramaType.MIN), // 6
      new LocalExtremaTableRowType('Max', 5, LocalExtramaType.MAX) // 7
    ]
  )

  async loadData(): Promise<void> {
    console.log('Loading dataset...')
    const dataLoader = new DataLoader()
    this.data = await dataLoader.loadData('./data/world.csv')
    console.log('Dataset loaded.')
  }

  private updateChartData(chart: TwitterChart, data: any[][]): void {
    chart.data[0].data = data[0]
    chart.data[1].data = data[5]
    chart.data[2].data = data[4]
    chart.data[3].data = data[3]
    chart.data[4].data = data[6]
    chart.data[5].data = data[7]
  }

  async makeOverviewChart(): Promise<void> {
    const chart = new TwitterChart(
      `COVID-19 Cases [${getNameFromKey(this.jurisdiction)}]`,
      'Source: OWID; Created by @USMortality',
      'Day',
      'COVID-19 Cases'
    )
    chart.data = [
      {
        axis: TwitterChartSeriesAxisType.x,
        type: TwitterChartSeriesConfigType.dot,
        label: this.table.columnTitles[0],
        color: [0, 0, 0, 1],
        isDashed: false,
      },
      {
        axis: TwitterChartSeriesAxisType.y,
        type: TwitterChartSeriesConfigType.line,
        label: this.table.columnTitles[5],
        color: [0, 0, 0, 1],
        isDashed: false,
      },
      {
        axis: TwitterChartSeriesAxisType.y,
        type: TwitterChartSeriesConfigType.line,
        label: this.table.columnTitles[4],
        color: [0, 200, 0, 0.67],
        isDashed: false,
      },
      {
        axis: TwitterChartSeriesAxisType.y,
        type: TwitterChartSeriesConfigType.dot,
        label: this.table.columnTitles[3],
        color: [0, 0, 255, 0.33],
        isDashed: false,
      },
      {
        axis: TwitterChartSeriesAxisType.x,
        type: TwitterChartSeriesConfigType.label,
        label: (rowIdx: number): string[] => ['Minimum', dateString(this.table.data[0][rowIdx])],
        color: [0, 0, 255, 1],
        isDashed: true,
      },
      {
        axis: TwitterChartSeriesAxisType.x,
        type: TwitterChartSeriesConfigType.label,
        label: (rowIdx: number): string[] => ['Maximum', dateString(this.table.data[0][rowIdx])],
        color: [255, 0, 0, 1],
        isDashed: true,
      },
    ]

    let rowIndex = 0
    for (const row of this.data.get(this.jurisdiction)) {
      console.log(`Processing ${row.date}`)

      this.table.extendColumn(0,
        fillerDateArray(row.date, this.extraDays)
      )
      this.table.insertRow([row.date, row.cases])
      this.updateChartData(chart, this.table.data)
      const lastT = zeroPad(rowIndex++, 3)
      await chart.save(`${this.folder}/${lastT}.png`)
      this.table.reduceColumn(0, this.extraDays)
    }
  }

  private getDateLabels(dateRow: any[], extraDays: number): Date[] {
    const lastDate = dateRow[dateRow.length - 1]
    return dateRow.concat(fillerDateArray(lastDate, extraDays))
  }

  async makeSliceChart(sliceIndex: number, slice: any[][]): Promise<void> {
    console.log('Making slice chart')

    const sliceTable: Table = new Table([
      new StaticTableRowType('Date'), // 0
      new StaticTableRowType('Cases (7d AVG)'), // 1
      new GaussTableRowType('Cases (7d AVG, smooth)', 1, 100), // 2
      new AutoIncrementTableRowType('Day', this.extraDays), // 3
      new ArithmeticTableRowType('Cases (7d AVG) - Background',
        2, ArithmeticFunction.SUB, 2, 0), // 4
      new GompertzTableRowType('Gompertz', 4, 3), // 5
      new ArithmeticTableRowType('Gompertz Prediction',
        5, ArithmeticFunction.ADD, 2, 0), // 6
    ])

    const chart = new TwitterChart(
      'COVID-19 Cases - Latest Wave '
      + `[${getNameFromKey(this.jurisdiction)}]`,
      'Source: OWID; Created by @USMortality',
      'Day',
      'COVID-19 Cases'
    )
    chart.data = [
      {
        axis: TwitterChartSeriesAxisType.x,
        type: TwitterChartSeriesConfigType.dot,
        label: sliceTable.columnTitles[0],
        color: [0, 0, 0, 1],
        isDashed: false,
      },
      {
        axis: TwitterChartSeriesAxisType.y,
        type: TwitterChartSeriesConfigType.line,
        label: sliceTable.columnTitles[8],
        color: [255, 0, 255, 1],
        isDashed: true,
      },
      {
        axis: TwitterChartSeriesAxisType.y,
        type: TwitterChartSeriesConfigType.line,
        label: sliceTable.columnTitles[2],
        color: [0, 0, 0, 1],
        isDashed: false,
      },
      {
        axis: TwitterChartSeriesAxisType.y,
        type: TwitterChartSeriesConfigType.line,
        label: sliceTable.columnTitles[1],
        color: [0, 200, 0, 0.67],
        isDashed: false,
      },
    ]

    const data = [this.getDateLabels(slice[0], this.extraDays), slice[4]]
    for (let i = 0; i < data[1].length; i++) {
      console.log(`Processing ${data[0][i]}`)
      sliceTable.insertRow([data[0][i], data[1][i]])
      sliceTable.extendColumn(0,
        fillerDateArray(data[0][i], this.extraDays)
      )
      const chartData = sliceTable.data
      this.updateSliceChartData(chart, chartData)
      const folder = `${this.folder}/${this.jurisdiction}/${sliceIndex}`
      await ensureDir(folder)
      const lastT = zeroPad(i, 3)
      await chart.save(`${folder}/${lastT}.png`)
      sliceTable.reduceColumn(0, this.extraDays)
    }
  }

  async makeSliceChart2(sliceIndex: number, slice: any[][]): Promise<void> {
    console.log('Making slice chart')

    const sliceTable: Table = new Table([
      new StaticTableRowType('Date'), // 0
      new StaticTableRowType('Cases (7d AVG)'), // 1
      new AutoIncrementTableRowType('x', this.extraDays), // 2
      new LoessTableRowType('Cases (7d AVG, Loess)', 1, 2), // 3
      new ArithmeticTableRowType('Cases (7d AVG, Loess) - Background',
        3, ArithmeticFunction.SUB, 3, 0), // 4
      new SumTableRowType('Reconstitute Total, X(t)', 4), // 5
      new GompertzJtS1TableRowType('log[Exp. Grow. Factor]', 5), // 6
      new GompertzJtS2TableRowType('log[Exp. Grow. Factor] 14d Trend',
        6, 2, 7), // 7
      new GompertzJtS3TableRowType('Prediction Total', 5, 2, 7), // 8
      new DiffTableRowType('Cases Prediction - Background', 8), // 9
      new ArithmeticTableRowType('Cases Prediction', 9,
        ArithmeticFunction.ADD, 3, 0), // 10
      new LocalExtremaTableRowType('Max', 10, LocalExtramaType.MAX) // 11
    ])

    const chart = new TwitterChart(
      'COVID-19 Cases - Latest Wave '
      + `[${getNameFromKey(this.jurisdiction)}]`,
      'Source: OWID; Created by @USMortality',
      'Day',
      'COVID-19 Cases',
      0,
      600,
      600
    )
    chart.data = [
      {
        axis: TwitterChartSeriesAxisType.x,
        type: TwitterChartSeriesConfigType.dot,
        label: sliceTable.columnTitles[0],
        color: [0, 0, 0, 1],
        isDashed: false,
      },
      {
        axis: TwitterChartSeriesAxisType.y,
        type: TwitterChartSeriesConfigType.line,
        label: sliceTable.columnTitles[10],
        color: [0, 0, 0, 1],
        isDashed: true,
      },
      {
        axis: TwitterChartSeriesAxisType.y,
        type: TwitterChartSeriesConfigType.line,
        label: sliceTable.columnTitles[3],
        color: [0, 0, 0, 1],
        isDashed: false,
      },
      {
        axis: TwitterChartSeriesAxisType.y,
        type: TwitterChartSeriesConfigType.line,
        label: sliceTable.columnTitles[1],
        color: [0, 200, 0, 0.67],
        isDashed: false,
      },
      {
        axis: TwitterChartSeriesAxisType.x,
        type: TwitterChartSeriesConfigType.label,
        label: (rowIndex: number): string[] => [
          'Max',
          numberWithCommas(sliceTable.data[10][rowIndex]),
          dateString(sliceTable.data[0][rowIndex])
        ],
        color: [255, 0, 0, .5],
        isDashed: true
      },
    ]

    const debugChart = new TwitterChart(
      'COVID-19 Cases - Latest Wave '
      + `[${getNameFromKey(this.jurisdiction)}]`,
      'Source: OWID; Created by @USMortality',
      'Day',
      'COVID-19 Cases',
      0,
      600,
      600
    )
    debugChart.data = [
      {
        axis: TwitterChartSeriesAxisType.x,
        type: TwitterChartSeriesConfigType.dot,
        label: sliceTable.columnTitles[0],
        color: [0, 0, 0, 1],
        isDashed: false,
      },
      {
        axis: TwitterChartSeriesAxisType.y,
        type: TwitterChartSeriesConfigType.line,
        label: sliceTable.columnTitles[6],
        color: [0, 0, 255, 1],
        isDashed: false,
      },
      {
        axis: TwitterChartSeriesAxisType.y,
        type: TwitterChartSeriesConfigType.line,
        label: sliceTable.columnTitles[7],
        color: [124, 166, 216, 1],
        isDashed: true,
      },
      {
        axis: TwitterChartSeriesAxisType.y2,
        type: TwitterChartSeriesConfigType.line,
        label: sliceTable.columnTitles[5],
        color: [255, 0, 0, 1],
        isDashed: false,
      },
      {
        axis: TwitterChartSeriesAxisType.y2,
        type: TwitterChartSeriesConfigType.line,
        label: sliceTable.columnTitles[8],
        color: [255, 0, 0, 1],
        isDashed: true,
      },
    ]

    const data = [this.getDateLabels(slice[0], this.extraDays), slice[4]]
    for (let i = 0; i < data[1].length; i++) {
      console.log(`Processing ${data[0][i]}`)
      sliceTable.insertRow([data[0][i], data[1][i]])

      const extraDates = fillerDateArray(data[0][i], this.extraDays)
      sliceTable.extendColumn(0, extraDates)

      const chartData = sliceTable.data
      this.updateSliceChartData(chart, chartData)
      this.updateDebugChartData(debugChart, chartData)
      const lastT = zeroPad(i, 3)
      const fileA = `${this.folder}/__a_${lastT}.png`
      await chart.save(fileA)
      const fileB = `${this.folder}/__b_${lastT}.png`
      await debugChart.save(fileB)
      const concatCmd = `convert \\( ${fileA} -append ${fileB} \\) `
        + `+append ./${this.folder}/${sliceIndex}_${lastT}.png`
      execSync(concatCmd)
      execSync(`rm -rf ${this.folder}/__*.png`)
      sliceTable.reduceColumn(0, this.extraDays)
    }
  }

  private updateSliceChartData(chart: TwitterChart, data: any[][]): void {
    chart.data[0].data = data[0]
    chart.data[1].data = data[10]
    chart.data[2].data = data[3]
    chart.data[3].data = data[1]
    chart.data[4].data = data[11]
  }

  private updateDebugChartData(chart: TwitterChart, data: any[][]): void {
    chart.data[0].data = data[0]
    chart.data[1].data = data[6]
    chart.data[2].data = data[7]
    chart.data[3].data = data[5]
    chart.data[4].data = data[8]
  }

  makeMovie(index: number, speed: number, resolution: string): void {
    const movie = `${this.folder}/_${this.jurisdiction}.mp4`
    execSync(`rm -rf ${movie}`)
    execSync(
      `ffmpeg -hide_banner -loglevel error -r ${speed} `
      + `-pattern_type glob -i '${this.folder}/*.png' -c:v libx264 `
      + `-vf "fps=60,format=yuv420p,scale=${resolution}" ${movie}`
    )
  }

  async processData(): Promise<void> {
    console.log('Processing data...')

    await this.setFolder(`./out/${this.jurisdiction}/0`)
    await this.makeOverviewChart()
    await this.makeMovie(0, 30, '1200x670')

    // Latest outbreak
    const sliceData = this.table.splitAt(6, 1)
    const sliceIndex = sliceData.length
    const lastSlice = sliceData[sliceIndex - 1]
    await this.setFolder(`./out/${this.jurisdiction}/${sliceIndex}`)
    await this.makeSliceChart2(sliceIndex, lastSlice)

    await this.makeMovie(sliceIndex, 5, '1200x600')

    console.log('Processing data finished.')
  }

  private async setFolder(folder): Promise<void> {
    execSync(`rm -rf ${folder}`)
    this.folder = folder
    return await ensureDir(folder)
  }

  async run(): Promise<void> {
    await this.loadData()
    await this.processData()
  }
}

const runner = new Runner()
runner.run()
