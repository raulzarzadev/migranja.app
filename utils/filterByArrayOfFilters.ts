import { getProperty } from 'dot-prop'

interface Filter<T> {
  field: keyof T
  symbol: '==' | '<' | '>' | '<=' | '>='
  value: any
}
const filterByArrayOfFilters = <T>(filters: Filter<T>[], array: T[]): T[] => {
  let aux: T[] = [...array]
  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i]
    const { field, symbol, value } = filter || {}
    const res = aux.filter((item) => {
      const fieldValue = getProperty(item, field as string)
      if (symbol === '==') return fieldValue === value
      if (symbol === '<') return fieldValue < value
      if (symbol === '>') return fieldValue > value
      if (symbol === '>=') return fieldValue >= value
      if (symbol === '<=') return fieldValue <= value
    })
    aux = [...res]
  }
  return aux
}
export default filterByArrayOfFilters
