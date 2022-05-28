import * as csvtojson from 'csvtojson'
import { getKey } from './common.js'

export interface Row {
  date: Date,
  cases: number
}

export class DataLoader {
  datasetCache: Map<string, Map<string, Row[]>> = new Map()

  async loadData(filename: string): Promise<Map<string, Row[]>> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await csvtojson
          .default({ delimiter: ',' })
          .fromFile(filename)
          .then(async (datas: any) => this.processCsvRows(datas)))
      } catch (e) {
        console.log('Error loading file, did you run `npm run update`?')
        reject(e)
      }
    })
  }

  shouldProcess(data): boolean {
    if (data.iso_code) { // world dataset
      if (data.iso_code.startsWith('OWID')) return false
      if (parseInt(data.population, 10) < 1000000) return false
    }
    return true
  }

  async processCsvRows(datas: any): Promise<Map<string, Row[]>> {
    const result: Map<string, Row[]> = new Map()
    for await (const data of datas) {
      if (!this.shouldProcess(data)) continue

      const jurisdiction = data.state || data.location
      if (!jurisdiction) continue

      const row: Row = {
        date: new Date(data.date),
        cases: parseInt(data.cases
          ? data.cases : data.total_cases, 10)
      }

      const key = getKey(jurisdiction)
      let arr: Row[] | undefined = result.get(key)
      if (!arr) {
        arr = []
        result.set(key, arr)
      }
      arr.push(row)
    }
    return result
  }

  async getRows(dataset: string): Promise<Map<string, Row[]>> {
    let result: Map<string, Row[]> = this.datasetCache.get(dataset)
    if (!result) {
      result = await this.loadData(dataset)
      this.datasetCache[dataset] = result
    }
    return result
  }
}
