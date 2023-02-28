import { useEffect, useState } from 'react'
import { getProperty } from 'dot-prop'
import filterByArrayOfFilters from 'utils/filterByArrayOfFilters'
import {
  filterArrayByFiledValueCoincidences,
  FilterSymbols
} from 'utils/filterArrayByFiledValueCoincidences'

export interface FilterType {
  field: string
  symbol: FilterSymbols
  value: any
}
const useFilterByField = <T,>(
  array: T[]
  //* default filtered it was implemented efficiently
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

    const res = filterArrayByFiledValueCoincidences(
      field,
      symbol,
      value,
      _array
    )
    _setArray(res)
  }
  const reset = () => {
    _setArray(array)
    setFiltersSelected([])
  }

  const handleFilterByArray = (
    filters: FilterType[],
    ops?: { label: string }
  ) => {
    const label = ops?.label

    if (label) {
      setFiltersSelected([...filtersSelected, label])
    }
    const res = filterByArrayOfFilters<any>(filters, _array)
    _setArray(res)
  }

  return {
    arrayFiltered: _array,
    handleFilterBy,
    handleFilterByArray,
    filtersSelected,
    reset
  }
}

export default useFilterByField
