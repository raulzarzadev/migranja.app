import { useState } from 'react'
import { getProperty } from 'dot-prop'

const useFilterByField = <T,>(array: T[]) => {
  const [arrayFiltered, setArrayFiltered] = useState<T[]>(array)

  const handleFilterBy = (
    field = '',
    symbol: '==' | '<' | '>' | '<=' | '>=',
    value: any
  ): T[] => {
    if (Array.isArray(array)) {
      const res = array?.filter((item) => {
        const fieldValue = getProperty(item, field)
        if (symbol === '==') return fieldValue === value
        if (symbol === '<') return fieldValue < value
        if (symbol === '>') return fieldValue < value
        if (symbol === '>=') return fieldValue >= value
        if (symbol === '<=') return fieldValue <= value
      })
      setArrayFiltered(res)
      return res
    } else {
      console.log('should be an array')
      return array
    }
  }

  return {
    arrayFiltered: arrayFiltered?.length ? arrayFiltered : array,
    handleFilterBy
  }
}

export default useFilterByField
