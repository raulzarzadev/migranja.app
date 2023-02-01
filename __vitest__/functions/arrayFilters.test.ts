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
  { name: 'foo', number: 10, teams: 6 },
  { name: 'fee', number: 11, teams: 4 },
  { name: 'lee', number: 100 },
  { name: 'io', number: 150 },
  { name: 'ox', number: 200 },
  { name: 'arc', number: 201, teams: 1 },
  { name: 'eco', number: 202, teams: 4 },
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
  it('should return 2 teams  > 2 & numbers > 200  ', () => {
    const res = filterByArrayOfFilters<Person>(
      [
        { field: 'teams', symbol: '>', value: 2 },
        { field: 'number', symbol: '>', value: 200 }
      ],
      array
    )
    expect(res.length).toBe(1)
  })
})
