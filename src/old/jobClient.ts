import { createClient } from 'redis'

export type JobConfig = {
    folder: string,
    dataset: string,
    jurisdiction: string,
    sliceIndex: number,
    day: number,
    runType: string
}

export class JobClient {
    client: any

    constructor() {
        return (async (): Promise<JobClient> => {
            this.client = createClient()
            await this.client.connect()

            return this
        })() as unknown as JobClient
    }

    async cleanup(): Promise<void> {
        await this.client.del('jobs')
    }

    async tearDown(): Promise<void> {
        await this.client.quit()
    }

    async getJob(): Promise<JobConfig | undefined> {
        return new Promise(async (resolve) => {
            let config: JobConfig
            const configJson = await this.client.rPop('jobs')
            if (!process.argv[2]) { // Automatic
                if (configJson === 'null') return undefined
                config = JSON.parse(configJson)
            } else { // Manual
                config = {
                    folder: process.argv[2],
                    dataset: process.argv[3],
                    jurisdiction: process.argv[4],
                    sliceIndex: parseInt(process.argv[5], 10),
                    day: parseInt(process.argv[6], 10),
                    runType: 'manual'
                }
            }
            resolve(config)
        })
    }

    async getNumberOfJobs(): Promise<number> {
        return await this.client.lLen('jobs')
    }

    async addJobConfig(config: JobConfig): Promise<void> {
        await this.client.lPush('jobs', JSON.stringify(config))
    }
}
