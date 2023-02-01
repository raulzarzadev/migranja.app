import { useEffect, useState } from 'react'
import { getProperty } from 'dot-prop'

export interface Options {
  defaultSortField?: string
  reverse?: boolean
}
export const sortByField = (
  arr: any[],
  fieldName: string,
  reverse: boolean
) => {
  const auxArr = [...arr]

  return auxArr.sort((a, b) => {
    if ((getProperty(a, fieldName) || '') < (getProperty(b, fieldName) || ''))
      return reverse ? -1 : 1
    if ((getProperty(a, fieldName) || '') > (getProperty(b, fieldName) || ''))
      return reverse ? 1 : -1
    return 0
  })
}

const useSortByField = (array: any[], ops?: Options) => {
  useEffect(() => {
    setArraySorted(array)
  }, [array])

  const defaultSortField = ops?.defaultSortField || ''
  const reverse = ops?.reverse || false
  const [field, setField] = useState('')
  const [sortReverse, setSortReverse] = useState<boolean>(false)
  const [arraySorted, setArraySorted] = useState<any[]>([])

  const handleSortBy = (fieldName: string) => {
    if (fieldName === '') {
      setArraySorted(array)
      setField(fieldName)
      return
    }
    setField(fieldName)
    setArraySorted(sortByField(array, fieldName, sortReverse))
    setSortReverse(!sortReverse)
  }

  return {
    arraySorted: arraySorted?.length
      ? arraySorted
      : sortByField(array, defaultSortField, reverse),
    handleSortBy,
    reverse: sortReverse,
    field,
    fieldSelected: field
  }
}

export default useSortByField
