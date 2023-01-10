import { useEffect, useState } from 'react'
import { getProperty } from 'dot-prop'

const useSortByField = (array: any[]) => {
  const [sortReverse, setSortReverse] = useState<boolean>(false)
  const [arraySorted, setArraySorted] = useState<any[]>([])

  useEffect(() => {
    setArraySorted(array)
  }, [array])

  const sortByField = (arr: any[], fieldName: string, reverse: boolean) => {
    const auxArr = [...arr]

    return auxArr.sort((a, b) => {
      if ((getProperty(a, fieldName) || '') < (getProperty(b, fieldName) || ''))
        return reverse ? -1 : 1
      if ((getProperty(a, fieldName) || '') > (getProperty(b, fieldName) || ''))
        return reverse ? 1 : -1
      return 0
    })
  }

  const handleFilterBy = (fieldName: string) => {
    setArraySorted(sortByField(array, fieldName, sortReverse))
    setSortReverse(!sortReverse)
  }

  return {
    arraySorted: arraySorted?.length ? arraySorted : array,
    handleFilterBy,
    reverse: sortReverse
  }
}

export default useSortByField
