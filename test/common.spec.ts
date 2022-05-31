import { DataLoader, Row } from './../src/dataLoader.js'
import { deepEqual } from 'assert'
import { expect } from 'chai'
import 'jest'
import {
  addDays, fillerArray, fillerDateArray, getKey, getNameFromKey,
  getNumberLength, capitalizeFirstLetters, dateString
} from '../src/common.js'

describe('common.ts', () => {
  describe('fillerArray', () => {
    it('fillerArray returns array of 2x `0`', () => {
      const result = fillerArray(2, 0)
      expect(result.length).to.equal(2)
      expect(result[0]).to.equal(0)
      expect(result[1]).to.equal(0)
    })
    it('fillerArray return array of 2x number', () => {
      const result = fillerArray(2, 10)
      expect(result.length).to.equal(2)
      expect(result[0]).to.equal(10)
      expect(result[1]).to.equal(10)
    })
  })
  describe('fillerDateArray', () => {
    it('produces array with 2 dates by increasing day', () => {
      const date = new Date()
      const result = fillerDateArray(date, 2)
      expect(result.length).to.equal(2)
      deepEqual(result[0], addDays(date, 1))
      deepEqual(result[1], addDays(date, 2))
    })
  })
  describe('getKey', () => {
    it('transforms a country string into a key', () => {
      const result = getKey('Cote d\'Ivoir')
      expect(result).to.equal('cote_d_ivoir')
    })
  })
  describe('getNameFromKey', () => {
    it('capitalizes name from key again', () => {
      const result = getNameFromKey('cote_d_ivoir')
      expect(result).to.equal('Cote D Ivoir')
    })
  })
  describe('addDays', () => {
    it('adds a day to given date', () => {
      const date = new Date()
      deepEqual(date, addDays(date, 0))
      const newDate = addDays(date, 1)
      expect(Math.abs(+date - +newDate)).to.equal(24 * 60 * 60 * 1000)
    })
  })
  describe('getNumberLength', () => {
    it('returns the digits of a number', () => {
      expect(getNumberLength(0)).to.equal(1)
      expect(getNumberLength(123)).to.equal(3)
    })
  })
  describe('processCsvRows', () => {
    const dataLoader = new DataLoader()
    it('usa.csv format parsing', async () => {
      const data = await dataLoader.processCsvRows([
        {
          date: '2020-03-17',
          state: 'Florida',
          cases: '10',
          location: undefined,
          /* eslint-disable-next-line camelcase */
          total_cases: undefined,
          /* eslint-disable-next-line camelcase */
          iso_code: undefined,
          population: undefined
        },
        /* eslint-disable-next-line camelcase */
        {
          date: '2020-03-18',
          state: 'Florida',
          cases: '15',
          location: undefined,
          /* eslint-disable-next-line camelcase */
          total_cases: undefined,
          /* eslint-disable-next-line camelcase */
          iso_code: undefined,
          population: undefined
        },
        /* eslint-disable-next-line camelcase */
        {
          date: '2020-03-17',
          state: 'Texas',
          cases: '25',
          location: undefined,
          /* eslint-disable-next-line camelcase */
          total_cases: undefined,
          /* eslint-disable-next-line camelcase */
          iso_code: undefined,
          population: undefined
        }
      ])
      const locationData: Row[] | undefined = data.get('florida')
      if (!locationData) throw new Error('No data found for florida!')
      expect(locationData.length).to.equal(2)
      deepEqual(locationData[0].date, new Date('2020-03-17'))
      deepEqual(locationData[1].date, new Date('2020-03-18'))
      expect(locationData[0].cases).to.equal(10)
    })
    it('world.csv format parsing', async () => {
      const data = await dataLoader.processCsvRows([
        {
          date: '2020-03-17',
          location: 'Germany',
          /* eslint-disable-next-line camelcase */
          total_cases: '10',
          /* eslint-disable-next-line camelcase */
          iso_code: undefined,
          population: undefined,
          state: undefined,
          cases: undefined
        },
        {
          date: '2020-03-18',
          location: 'Germany',
          /* eslint-disable-next-line camelcase */
          total_cases: '15',
          /* eslint-disable-next-line camelcase */
          iso_code: undefined,
          population: undefined,
          state: undefined,
          cases: undefined
        },
        {
          date: '2020-03-17',
          location: 'France',
          /* eslint-disable-next-line camelcase */
          total_cases: '25',
          /* eslint-disable-next-line camelcase */
          iso_code: undefined,
          population: undefined,
          state: undefined,
          cases: undefined
        }
      ])
      const locationData: Row[] | undefined = data.get('germany')
      if (!locationData) throw new Error('No data found for germany!')
      expect(locationData.length).to.equal(2)
      deepEqual(locationData[0].date, new Date('2020-03-17'))
      deepEqual(locationData[1].date, new Date('2020-03-18'))
      expect(locationData[0].cases).to.equal(10)
    })
  })
  describe('capitalizeFirstLetters', () => {
    expect(capitalizeFirstLetters('lorem ipsum a dolores'))
      .to.equal('Lorem Ipsum A Dolores')
  })
  describe('dateString', () => {
    expect(dateString(new Date('2020-01-01'))).to.equal('1/1/2020')
  })
})
