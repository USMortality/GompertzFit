import lowess from '@stdlib/stats-lowess'

export function sumFunction(data: any[]): number {
    let sum = 0
    for (const element of data[1]) sum += element
    return sum as any
}

export function sumNFunction(data: any[]): number {
    const n = 7
    const colIndex = 1
    const start: number = data[colIndex].length < n ?
        0 : data[colIndex].length - n
    let sum = 0
    for (let i = start; i < data[colIndex].length; i++) {
        sum += data[colIndex][i]
    }
    return sum as any
}

export function lowessFunction(data: any[]): number {
    if (data[0].length < 2) return 0

    const loess = getLoess(data[0], data[1])
    return Math.round(loess[loess.length - 1])
}

function getLoess(
    t: number[],
    values: number[],
    smoothFactor: number = 2 / 3
): number[] {
    return lowess(t, values, { 'f': smoothFactor }).y
}
