import { useState } from 'react'
import { getProperty } from 'dot-prop'
export interface Options {
  searchInFields: string[]
}
const useFilterByField = (array: any[], ops: Options) => {
  const [arrayFiltered, setArrayFiltered] = useState([...array])
  const handleFilterBy = (filterBy: string) => {
    const res = array.filter((item) => {
      for (let i = 0; i < ops.searchInFields.length; i++) {
        const fieldName = ops.searchInFields[i]
        const value = getProperty(item, fieldName) || ''
        if (Array.isArray(value)) {
          let includes = false
          value.forEach(({ earring }) => {
            includes = earring.includes(filterBy)
          })
          return includes
        } else {
          return value.includes(filterBy)
        }
      }
    })
    setArrayFiltered(res)
  }

  return {
    arrayFiltered: arrayFiltered?.length ? arrayFiltered : array,
    handleFilterBy
  }
}

export default useFilterByField
