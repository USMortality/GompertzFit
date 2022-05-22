import { ChartConfiguration } from 'chart.js'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import { promisify } from 'node:util'
import { writeFile } from 'fs'

export enum TwitterChartSeriesAxisType { x, y }
export enum TwitterChartSeriesConfigType { dot, line }
export type TwitterChartSeries = {
    axis: TwitterChartSeriesAxisType,
    type: TwitterChartSeriesConfigType,
    label: string,
    color: number[],
    data: any[]
}

export class TwitterChart {
    title: string
    subtitle: string
    xTitle: string
    yTitle: string
    data: TwitterChartSeries[]

    constructor(
        title: string,
        subtitle: string,
        xTitle: string,
        yTitle: string,
        data: TwitterChartSeries[]
    ) {
        this.title = title
        this.subtitle = subtitle
        this.xTitle = xTitle
        this.yTitle = yTitle
        this.data = data
    }

    async save(filename: string): Promise<void> {
        const buffer: Buffer = await this.makeChart()
        await this.saveImage(buffer, filename)
    }

    makeDataSet(): any[] {
        const datasets: any[] = []
        for (const data of this.data) {
            if (data.axis === TwitterChartSeriesAxisType.x) continue
            datasets.push({
                label: data.label,
                data: data.data,
                borderColor: `rgba(${data.color[0]}, ${data.color[1]},` +
                    ` ${data.color[2]}, 100%)`,
                backgroundColor: `rgba(${data.color[0]}, ${data.color[1]},` +
                    ` ${data.color[2]}, 100%)`,
                fill: false,
                borderWidth: data.type === TwitterChartSeriesConfigType.dot ?
                    0 : 2,
                pointRadius: data.type === TwitterChartSeriesConfigType.dot ?
                    2.5 : 0,
                tension: 0.4,
            })
        }
        return datasets
    }

    async makeChart(): Promise<Buffer> {
        const width = 600
        const height = 335
        const backgroundColour = 'white'
        const chartJSNodeCanvas = new ChartJSNodeCanvas({
            width, height, backgroundColour, plugins: {
                modern: ['chartjs-plugin-annotation'],
            }
        })

        const configuration: ChartConfiguration = {
            type: 'line',
            data: {
                datasets: this.makeDataSet(),
                labels: this.data[0].data
            },
            options: {
                responsive: true,
                devicePixelRatio: 2,
                plugins: {
                    annotation: {
                        // annotations: chartConfig.lines
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
                            // callback: (value, index, values) => {
                            //     const date: Date = labelsExtended[index]
                            //     if (date.getDate() === 1) {
                            //         return `${date.getMonth() + 1}/` +
                            //             `${date.getFullYear().toString()}`
                            //     }
                            //     return null
                            // }
                        }
                    },
                    y: {
                        min: 0,
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
        return await chartJSNodeCanvas.renderToBuffer(configuration)
    }

    saveImage(image: Buffer, filename: string): Promise<void> {
        const writeFileAsync = promisify(writeFile)
        return writeFileAsync(filename, image, 'base64')
    }
}
