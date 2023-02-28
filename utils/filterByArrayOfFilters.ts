import {
  filterArrayByFiledValueCoincidences,
  FilterSymbols
} from './filterArrayByFiledValueCoincidences'

interface Filter<T> {
  field: keyof T
  symbol: FilterSymbols
  value: any
}
const filterByArrayOfFilters = <T>(filters: Filter<T>[], array: T[]): T[] => {
  let aux: T[] = [...array]
  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i]
    const { field, symbol, value } = filter || {}
    const res = filterArrayByFiledValueCoincidences(
      field as string,
      symbol,
      value,
      aux
    )
    aux = [...res]
  }
  return aux
}
export default filterByArrayOfFilters
