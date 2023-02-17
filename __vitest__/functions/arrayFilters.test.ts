import filterByArrayOfFilters from 'utils/filterByArrayOfFilters'
import { describe, expect, it } from 'vitest'

interface Person {
  name: string
  number: number
  teams?: number
}
const array: Person[] = [
  { name: 'llan', number: -10 },
  { name: 'lim', number: -9 },
  { name: 'lais', number: -1 },
  { name: 'lu', number: 0 },
  { name: 'foo', number: 10, teams: 6 }, //*
  { name: 'fee', number: 11, teams: 4 }, //*
  { name: 'lee', number: 100 },
  { name: 'io', number: 150 },
  { name: 'ox', number: 200 },
  { name: 'arc', number: 201, teams: 1 },
  { name: 'eco', number: 202, teams: 4 }, //** */
  { name: 'op', number: 300, teams: 2 }
]

describe('Array of filters', () => {
  it('should return full array', () => {
    const res = filterByArrayOfFilters<Person>([], array)
    expect(res?.length).toBe(array.length)
  })
  it('should return 3 where all are minus  than 0', () => {
    const res = filterByArrayOfFilters<Person>(
      [{ field: 'number', symbol: '<', value: 0 }],
      array
    )
    expect(res.length).toBe(3)
  })
  it('should return 3 where all  >= -1 && <= 10', () => {
    const res = filterByArrayOfFilters<Person>(
      [
        { field: 'number', symbol: '>=', value: -1 },
        { field: 'number', symbol: '<=', value: 10 }
      ],
      array
    )
    expect(res.length).toBe(3)
  })

  it('should return 4 teams >=2', () => {
    const res = filterByArrayOfFilters<Person>(
      [{ field: 'teams', symbol: '>=', value: 2 }],
      array
    )
    expect(res.length).toBe(4)
  })
  it('should return 3 teams  > 2 ', () => {
    const res = filterByArrayOfFilters<Person>(
      [{ field: 'teams', symbol: '>', value: 2 }],
      array
    )
    expect(res.length).toBe(3)
  })
  it('should return 1 teams  > 2 & numbers > 200  ', () => {
    const res = filterByArrayOfFilters<Person>(
      [
        { field: 'teams', symbol: '>', value: 2 },
        { field: 'number', symbol: '>', value: 200 }
      ],
      array
    )
    expect(res.length).toBe(1)
  })
  it('should return 11 all different to eco  ', () => {
    const res = filterByArrayOfFilters<Person>(
      [{ field: 'name', symbol: '!=', value: 'eco' }],
      array
    )
    expect(res.length).toBe(11)
  })
  it('should return 10 all different to eco or op  ', () => {
    const res = filterByArrayOfFilters<Person>(
      [{ field: 'name', symbol: 'notInArray', value: ['eco', 'op'] }],
      array
    )
    expect(res.length).toBe(10)
  })
  it('should return 5 that are include in array   ', () => {
    const res = filterByArrayOfFilters<Person>(
      [
        {
          field: 'name',
          symbol: 'inArray',
          value: ['eco', 'op', 'arc', 'ox', 'io']
        }
      ],
      array
    )
    expect(res.length).toBe(5)
  })
  it('should return 0 is empty array is passed as value  ', () => {
    const res = filterByArrayOfFilters<Person>(
      [
        {
          field: 'name',
          symbol: 'inArray',
          value: []
        }
      ],
      array
    )
    expect(res.length).toBe(0)
  })
  it('should return 1 if string is passed and is a valid search  ', () => {
    const res = filterByArrayOfFilters<Person>(
      [
        {
          field: 'name',
          symbol: 'inArray',
          value: 'ox'
        }
      ],
      array
    )
    expect(res.length).toBe(1)
  })
  it('should return empty array if number is passed if "inArray or notInArray" is passed  ', () => {
    const res = filterByArrayOfFilters<Person>(
      [
        {
          field: 'name',
          symbol: 'inArray',
          value: 1
        }
      ],
      array
    )
    expect(res.length).toBe(0)
  })
})
