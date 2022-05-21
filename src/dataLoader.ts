import { loadData } from './common.js'
import { Row } from './series.js'

export class DataLoader {
    datasetCache: Map<string, Map<string, Row[]>> = new Map()

    async getRows(dataset: string): Promise<Map<string, Row[]>> {
        let result: Map<string, Row[]> = this.datasetCache.get(dataset)
        if (!result) {
            result = await loadData(dataset)
            this.datasetCache[dataset] = result
        }
        return result
    }

}