import { readFile, writeFile } from 'fs'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream'
import fetch from 'node-fetch'

import { Slice } from './old/slice.js'

// tslint:disable-next-line: no-unnecessary-initializer
export function fillerArray(end: number, filler: any = undefined): number[] {
    const result = []
    for (let i = 0; i < end; i++) result.push(filler)
    return result
}

export function fillerDateArray(fromDate: Date, end: number): Date[] {
    const result = []
    const start = fromDate
    for (let i = 0; i < end; i++) result.push(addDays(start, i + 1))
    return result
}

export function getKey(jurisdiction: string): string {
    return capitalizeFirstLetters(jurisdiction).replace(/[\W]+/g, '_')
        .toLowerCase()
}

export function getNameFromKey(key: string): string {
    return capitalizeFirstLetters(key.replace(/_/g, ' '))
}

export function addDays(date: Date, days: number): Date {
    const newDate = new Date(date.valueOf())
    newDate.setDate(newDate.getDate() + days)
    return newDate
}

export async function saveImage(image: Buffer, filename: string):
    Promise<void> {
    return new Promise((resolve) => {
        writeFile(filename, image, 'base64', (err) => {
            if (err) console.error(err)
            resolve()
        })
    })
}

export function getNumberLength(val: number): number {
    return val.toString().length
}

export async function loadJson(filename: string): Promise<object> {
    return new Promise((resolve, reject) => {
        readFile(filename, { encoding: 'utf-8' }, (err, data) => {
            if (err || !data) reject(err)
            try { resolve(JSON.parse(data)) } catch (e) { reject(e) }
        })
    })
}

export async function loadSlices(
    folder: string, jurisdiction: string
): Promise<Slice[]> {
    return new Promise((resolve, reject) => {
        readFile(`./out/${folder}/${jurisdiction}/slices.json`,
            { encoding: 'utf-8' }, (err, data) => {
                if (err || !data) reject(err)
                try { resolve(JSON.parse(data)) } catch (e) { reject(e) }
            })
    })
}

export function capitalizeFirstLetters(str: string): string {
    return str.toLowerCase().replace(/^\w|\s\w/g, (letter) => {
        return letter.toUpperCase()
    })
}

export async function download(urlString: string, file: string): Promise<void> {
    const response = await fetch(urlString)
    if (!response.ok) {
        throw new Error(`unexpected response ${response.statusText}`)
    }
    return new Promise((resolve) => {
        pipeline(response.body, createWriteStream(file), (err) => {
            if (err) console.error(err)
            resolve()
        })
    })
}

export function dateString(date: Date): string {
    return date.toLocaleDateString('en-US', { timeZone: 'UTC' })
}

export function zeroPad(num, places): string {
    return String(num).padStart(places, '0')
}

export function printMemory(): void {
    const used = process.memoryUsage().heapUsed / 1024 / 1024
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`)
}

export function zeroIfNanOrInfinite(value: number): number {
    return (isNaN(value) || !isFinite(value)) ? 0 : value
}
