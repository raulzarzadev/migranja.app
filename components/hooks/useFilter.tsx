import { useEffect, useState } from 'react'
import { getProperty } from 'dot-prop'
import filterByArrayOfFilters from 'utils/filterByArrayOfFilters'
import {
  filterArrayByFiledValueCoincidences,
  FilterSymbols
} from 'utils/filterArrayByFiledValueCoincidences'

¿
interface FilterType<T> {
  field: keyof T
  symbol: FilterSymbols
  value: any
}
const useFilterByField = <T,>(
  array: T[]
  // ops?: { defaultFilter?: any[]; labelDefaultFilter?: string }
) => {
  const [_array, _setArray] = useState<T[]>([])
  const [filtersSelected, setFiltersSelected] = useState<string[]>([])

  useEffect(() => {
    _setArray(array)
  }, [array])

  const handleFilterBy = (
    field = '',
    symbol: FilterSymbols,
    value: any,
    ops?: { label: string }
  ) => {
    const label = ops?.label

    if (label) {
      setFiltersSelected([...filtersSelected, label])
    }
    const handleFilterBy = <T,>(
      filters: Filter<T>[],
      array: T[]
    ): T[] => {
      let aux: T[] = [...array]
      for (let i = 0; i < filters.length; i++) {
        const filter = filters[i]
        const { field, symbol, value } = filter || {}
        const res = filterArrayByFiledValueCoincidences(
          field as string,
          symbol,
          value,
          array
        )

        aux = [...res]
      }
      return aux
    }
  }
  const reset = () => {
    _setArray(array)
    setFiltersSelected([])
  }

  return {
    arrayFiltered: _array,
    handleFilterBy,
    // handleFilterByArray,
    filtersSelected,
    reset
  }
}

export default useFilterByField
