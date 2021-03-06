import { DataType } from './table/table'
import { ChartConfiguration } from 'chart.js'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import { promisify } from 'node:util'
import { writeFile } from 'fs'

export enum TwitterChartSeriesAxisType { x, y, y2 }
export enum TwitterChartSeriesConfigType { dot, line, label }
export interface TwitterChartSeries {
  axis: TwitterChartSeriesAxisType,
  type: TwitterChartSeriesConfigType,
  label: string | ((rowIndex: number) => string[]),
  color: number[],
  isDashed: boolean,
  data?: DataType
}

interface Line {
  type: string,
  xMin: number,
  xMax: number,
  borderColor: string,
  borderWidth: number,
  borderDash: number[],
  label: {
    rotation: boolean,
    position: string,
    content: string[],
    font: {
      size: number
    },
    enabled: boolean
  }
}

const line: Line = {
  type: 'line',
  xMin: 60,
  xMax: 60,
  borderColor: 'rgb(0, 0, 0)',
  borderWidth: 1,
  borderDash: [0, 0],
  label: {
    rotation: false,
    position: 'start',
    content: [],
    font: {
      size: 8
    },
    enabled: false
  }
}

export class TwitterChart {
  title: string
  subtitle: string
  xTitle: string
  yTitle: string
  data: TwitterChartSeries[]
  labelIndex: number
  width: number
  height: number

  private chartJSNodeCanvas: ChartJSNodeCanvas

  constructor(
    title: string,
    subtitle: string,
    xTitle: string,
    yTitle: string,
    labelIndex = 0,
    width = 600,
    height = 335,
  ) {
    this.title = title
    this.subtitle = subtitle
    this.xTitle = xTitle
    this.yTitle = yTitle
    this.labelIndex = labelIndex
    this.width = width
    this.height = height

    this.chartJSNodeCanvas = new ChartJSNodeCanvas({
      width: this.width,
      height: this.height,
      backgroundColour: 'white',
      plugins: {
        modern: ['chartjs-plugin-annotation'],
      },
    })
  }

  async save(filename: string): Promise<void> {
    const buffer: Buffer = await this.makeChart()
    await this.saveImage(buffer, filename)
  }

  makeLabels(): object[] {
    const labels: object[] = []
    for (const data of this.data) {
      if (data.axis === TwitterChartSeriesAxisType.x
        && data.type === TwitterChartSeriesConfigType.label) {
        const datas = data.data
        if (!datas) throw new Error('asdf')

        for (let i = 0; i < datas.length; i++) {
          const row = datas[i]
          if (row > 0) {
            line.xMin = i
            line.xMax = i
            line.borderColor = `rgb(${data.color.join(',')})`
            line.label.enabled = true
            line.borderDash = data.isDashed ? [4, 6] : [0, 0]
            line.label.content = this.getLineLabel(data.label, i)
            labels.push(JSON.parse(JSON.stringify(line)) as object)
          }
        }
      }
    }
    return labels
  }

  private getLineLabel(
    label: string | ((rowIndex: number) => string[]),
    rowIndex: number
  ): string[] {
    if (label instanceof Function) return label(rowIndex)
    else return [label]
  }

  makeDataSet(): object[] {
    const datasets: object[] = []
    for (const data of this.data) {
      if (data.axis === TwitterChartSeriesAxisType.x) continue
      datasets.push({
        yAxisID: data.axis === TwitterChartSeriesAxisType.y ? 'y' : 'y2',
        label: data.label,
        data: data.data,
        borderColor: `rgba(${data.color.join(',')})`,
        backgroundColor: `rgba(${data.color.join(',')})`,
        fill: false,
        borderDash: data.isDashed ? [4, 4] : [0, 0],
        borderWidth: data.type === TwitterChartSeriesConfigType.dot ? 0 : 2,
        pointRadius: data.type === TwitterChartSeriesConfigType.dot ? 2.5 : 0,
        tension: 0.4,
      })
    }
    return datasets
  }

  async makeChart(): Promise<Buffer> {
    const configuration: ChartConfiguration = {
      type: 'line',
      data: {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
        datasets: this.makeDataSet() as any,
        labels: this.data[this.labelIndex].data
      },
      options: {
        responsive: true,
        devicePixelRatio: 2,
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
        plugins: {
          annotation: {
            annotations: this.makeLabels()
          },
          title: {
            display: true,
            color: 'rgba(0, 0, 0, 100%)',
            text: this.title,
            font: {
              size: 18
            }
          },
          subtitle: {
            display: true,
            color: 'rgba(120, 120, 120, 100%)',
            text: this.subtitle,
            font: {
              weight: '200',
              size: 11
            }
          },
          legend: {
            display: true,
            labels: {
              color: 'rgba(0, 0, 0, 100%)',
              font: {
                weight: '200',
                size: 12
              }
            },
            usePointStyle: true,
            pointStyle: 'cross'
          }
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        } as any,
        scales: {
          x: {
            grid: {
              drawOnChartArea: false
            },
            title: {
              display: true,
              text: this.xTitle,
              font: {
                weight: '200',
                size: 11
              },
              color: 'rgba(120, 120, 120, 100%)',
            },
            ticks: {
              font: {
                weight: '200',
                size: 10
              },
              color: 'rgba(0, 0, 0, 100%)',
              callback: (_value, index) => {
                const labelData = this.data[this.labelIndex]
                if (!labelData.data) throw new Error('No data found for label.')
                const item = labelData.data[index]
                if (item instanceof Date) {
                  if (item.getDate() === 1) {
                    return `${item.getMonth() + 1}/`
                      + `${item.getFullYear().toString()}`
                  }
                  return null
                } else return item
              }
            }
          },
          y: {
            type: 'linear',
            position: 'left',
            // min: 0,
            // max: chartConfig.yMax,
            title: {
              display: true,
              text: this.yTitle,
              font: {
                weight: '200',
                size: 11
              },
              color: 'rgba(120, 120, 120, 100%)',
            },
            ticks: {
              font: {
                weight: '200',
                size: 10
              },
              color: 'rgba(0, 0, 0, 100%)',
            }
          },
          y2: {
            type: 'logarithmic',
            position: 'right',
            display: 'auto',
            // min: 0,
            // max: chartConfig.yMax,
            title: {
              display: true,
              text: this.yTitle,
              font: {
                weight: '200',
                size: 11
              },
              color: 'rgba(120, 120, 120, 100%)',
            },
            ticks: {
              font: {
                weight: '200',
                size: 10
              },
              color: 'rgba(0, 0, 0, 100%)',
            }
          }
        }
      },
      plugins: [],
    }
    // console.log(JSON.stringify(configuration, null, 2))
    return await this.chartJSNodeCanvas.renderToBuffer(configuration)
  }

  saveImage(image: Buffer, filename: string): Promise<void> {
    const writeFileAsync = promisify(writeFile)
    return writeFileAsync(filename, image, 'base64')
  }
}
