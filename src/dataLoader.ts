import * as csvtojson from 'csvtojson'
import { getKey } from './common.js'

export interface Row {
  date: Date,
  cases: number
}

interface RawDataRow {
  state: string | undefined,
  location: string | undefined,
  date: string,
  cases: string | undefined,
  total_cases: string | undefined,
  iso_code: string | undefined,
  population: string | undefined
}

export class DataLoader {
  datasetCache: Map<string, Map<string, Row[]>> = new Map()

  async loadData(filename: string): Promise<Map<string, Row[]>> {
    return csvtojson
      .default({ delimiter: ',' })
      .fromFile(filename)
      .then(async (datas: RawDataRow[]) => this.processCsvRows(datas))
  }

  shouldProcess(data: RawDataRow): boolean {
    if (data.iso_code) { // world dataset
      if (data.iso_code.startsWith('OWID')) {
        return false
      } else if (data.population && parseInt(data.population, 10) < 1000000) {
        return false
      }
    }
    return true
  }
  async processCsvRows(datas: RawDataRow[]): Promise<Map<string, Row[]>> {
    const result: Map<string, Row[]> = new Map()
    for await (const data of datas) {
      if (!this.shouldProcess(data)) continue

      const jurisdiction = data.state ?? data.location
      if (!jurisdiction) continue

      const casesOrTotalCases = data.cases ? data.cases : data.total_cases
      const row: Row = {
        date: new Date(data.date),
        cases: parseInt(casesOrTotalCases ? casesOrTotalCases : '0', 10)
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
    let result: Map<string, Row[]> | undefined = this.datasetCache.get(dataset)
    if (!result) {
      result = await this.loadData(dataset)
      this.datasetCache[dataset] = result
    }
    return result
  }
}
