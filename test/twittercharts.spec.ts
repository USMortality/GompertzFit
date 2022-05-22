import { Table } from '../src/table/table'
import { TwitterChart } from './../src/twitterChart'
import { expect } from 'chai'
import 'jest'
import looksSame from 'looks-same'
import { StaticTableRowType } from '../src/table/tableRowType'

describe('TwitterChart', () => {
    it('create chart', async () => {
        const table = new Table([
            new StaticTableRowType('date'),
            new StaticTableRowType('cases')
        ])
        table.insertRows([
            [1, 2, 3, 4, 5, 6, 7],
            [10, 20, 15, 20, 23, 17, 25]
        ])
        const twitterchart = new TwitterChart(
            'Test Chart',
            table.data,
        )
        await twitterchart.save('./test/out/test.png')
        looksSame('./test/out/expected.png', './test/out/test.png',
            (_, { equal }) => {
                expect(equal).to.equal(true)
            })
    })
})