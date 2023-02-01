import { useState } from 'react'
import { getProperty } from 'dot-prop'
import filterByArrayOfFilters from 'utils/filterByArrayOfFilters'

interface FilterType {
  field: string
  symbol: '==' | '<' | '>' | '<=' | '>='
  value: any
}
const useFilterByField = <T,>(array: T[]) => {
  const [_array, _setArray] = useState([...array])
  const [filtersSelected, setFiltersSelected] = useState<string[]>([])

  const handleFilterBy = (
    field = '',
    symbol: '==' | '<' | '>' | '<=' | '>=',
    value: any,
    ops?: { label: string }
  ) => {
    const label = ops?.label

    if (label) {
      setFiltersSelected([...filtersSelected, label])
    }

    if (Array.isArray(_array)) {
      const res = _array?.filter((item) => {
        const fieldValue = getProperty(item, field)
        if (symbol === '==') return fieldValue === value
        if (symbol === '<') return fieldValue < value
        if (symbol === '>') return fieldValue > value
        if (symbol === '>=') return fieldValue >= value
        if (symbol === '<=') return fieldValue <= value
      })
      _setArray(res)
      return res
    }
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
