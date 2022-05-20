import { Table } from './../src/table'
import { TwitterChart } from './../src/twitterChart'
import { expect } from 'chai'
import 'jest'
import looksSame from 'looks-same'

describe('TwitterChart', () => {
    it('create chart', async () => {
        const table = new Table(['date', 'cases'])
        table.insertRows([
            [1, 2, 3, 4, 5, 6, 7],
            [10, 20, 15, 20, 23, 17, 25]
        ])
        console.log(table.getData())
        const twitterchart = new TwitterChart(
            'Test Chart',
            table.getData(),
        )
        await twitterchart.save('./out/test/test.png')
        looksSame('./out/test/expected.png', './out/test/test.png',
            (_, { equal }) => {
                expect(equal).to.equal(true)
            })
    })
})