import { Table } from './../src/table'
import { TwitterChart } from './../src/twitterChart'

describe('TwitterChart', () => {
    it('create chart', async () => {
        const table = new Table(['date', 'cases'])
        table.insertRows([
            [1, 2, 3, 4, 5, 6, 7],
            [10, 20, 15, 20, 23, 17, 25]
        ])
        console.log(table.getData())
        const twitterchart = new TwitterChart(table.getData())
        await twitterchart.save()
    })
})