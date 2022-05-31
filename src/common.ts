import { readFile, writeFile, createWriteStream } from 'fs'
import fetch from 'node-fetch'

export function fillerArray(end: number, filler: number): number[] {
  const result: number[] = []
  for (let i = 0; i < end; i++) result.push(filler)
  return result
}

export function fillerAutoIncrementArray(
  end: number,
  filler = 0
): number[] {
  const result: number[] = []
  for (let i = 0; i < end; i++) result.push(filler++)
  return result
}

export function fillerDateArray(fromDate: Date, end: number): Date[] {
  const result: Date[] = []
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
  return new Promise(res => {
    writeFile(filename, image, 'base64', err => {
      if (err) console.error(err)
      res()
    })
  })
}

export function getNumberLength(val: number): number {
  return val.toString().length
}

export async function loadJson(filename: string): Promise<object> {
  return new Promise((res, reject) => {
    readFile(filename, { encoding: 'utf-8' }, (err, data) => {
      if (err || !data) reject(err)
      try {
        res(JSON.parse(data) as object)
      } catch (e) {
        reject(e)
      }
    })
  })
}

export function capitalizeFirstLetters(str: string): string {
  return str.toLowerCase().replace(/^\w|\s\w/g, letter => letter.toUpperCase())
}

export async function download(urlString: string, file: string): Promise<void> {
  const response = await fetch(urlString)
  if (!response.body || !response.ok) {
    throw new Error(
      `Error making request: ${JSON.stringify(response, null, 2)}`
    )
  }
  const stream = createWriteStream(file)
  response.body.on('data', chunk => stream.write(chunk))
}

export function dateString(date: Date): string {
  return date.toLocaleDateString('en-US', { timeZone: 'UTC' })
}

export function zeroPad(num: number, places: number): string {
  return String(num).padStart(places, '0')
}

export function printMemory(): void {
  const used = process.memoryUsage().heapUsed / 1024 / 1024
  console.log(
    `The script uses approximately ${Math.round(used * 100) / 100} MB`
  )
}

export function zeroIfNanOrInfinite(value: number): number {
  return isNaN(value) || !isFinite(value) ? 0 : value
}

export function numberWithCommas(
  num: number,
  round = true
): string {
  const x = round ? Math.round(num) : num
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
