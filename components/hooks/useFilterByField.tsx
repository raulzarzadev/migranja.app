import { useState } from 'react'
import { getProperty } from 'dot-prop'

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
        if (symbol === '>') return fieldValue < value
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
  return {
    arrayFiltered: _array,
    handleFilterBy,
    filtersSelected,
    reset
  }
}

export default useFilterByField
