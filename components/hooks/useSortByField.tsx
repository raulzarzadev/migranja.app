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
  const defaultSortField = ops?.defaultSortField || ''
  const reverse = ops?.reverse || false
  const [field, setField] = useState('')
  const [sortReverse, setSortReverse] = useState<boolean>(false)
  const [arraySorted, setArraySorted] = useState<any[]>([])

  const handleSortBy = (fieldName: string) => {
    setArraySorted(sortByField(array, fieldName, sortReverse))
    setSortReverse(!sortReverse)
    setField(fieldName)
  }

  return {
    arraySorted: arraySorted?.length
      ? arraySorted
      : sortByField(array, defaultSortField, reverse),
    handleSortBy,
    reverse: sortReverse,
    field
  }
}

export default useSortByField
