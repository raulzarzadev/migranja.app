import { getProperty } from 'dot-prop'

export type FilterSymbols =
  | '=='
  | '<'
  | '>'
  | '<='
  | '>='
  | '!='
  | 'inArray'
  | 'notInArray'

export const filterArrayByFiledValueCoincidences = <T>(
  field: string,
  symbol: FilterSymbols,
  value: any,
  array: T[]
): T[] => {
  if (Array.isArray(array)) {
    const res = array?.filter((item) => {
      const fieldValue = getProperty(item, field) || ''
      if (symbol === '==') return fieldValue === value
      if (symbol === '<') return fieldValue < value
      if (symbol === '>') return fieldValue > value
      if (symbol === '>=') return fieldValue >= value
      if (symbol === '<=') return fieldValue <= value
      if (symbol === '!=') return fieldValue != value
      if (Array.isArray(value) || typeof value === 'string') {
        if (symbol === 'inArray') return value.includes(`${fieldValue}`)
        if (symbol === 'notInArray') return !value.includes(`${fieldValue}`)
      }
    })
    return res
  }
  return []
}
