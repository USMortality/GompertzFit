import { ChartConfiguration } from 'chart.js'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import { promisify } from 'node:util'
import { writeFile } from 'fs'

export class TwitterChart {
    title: string
    data: [][]
    constructor(title: string, data: any[]) {
        this.title = title
        this.data = data
    }

    async save(filename: string): Promise<void> {
        const buffer: Buffer = await this.makeChart()
        await this.saveImage(buffer, filename)
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

        const datasets = []
        datasets.push({
            label: 'Cases',
            data: this.data[1],
            borderColor: 'rgba(255, 71, 155, 100%)',
            fill: false,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
        })
        const configuration: ChartConfiguration = {
            type: 'line',
            data: {
                datasets,
                labels: this.data[0]
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
                            text: 'Date',
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
                            text: 'Cases',
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
