import { format, formatDistanceStrict } from 'date-fns'
import { es } from 'date-fns/locale'

type FormatType = 'input-datetime' | 'input' | string
interface Options {
  dateOnly?: boolean
}
export const myFormatDate = (
  date: string | number | Date | undefined,
  strFormat: 'input-datetime' | 'input' | string,
  options?: Options
): string => {
  if (!date) {
    console.error('No date')
    return ''
  }
  const dateOnly = options?.dateOnly

  // format date without timezone to manage properly inputs
  const dt = new Date(date)
  const dtDateOnly = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000)

  const res = format(
    validDateAsNumber(dateOnly ? dtDateOnly : date),
    choseDateFormat(strFormat),
    {
      locale: es
    }
  )
  return res
}

export const fromNow = (
  date?: string | number | Date,
  options?:
    | {
        addSuffix?: boolean | undefined
        unit?:
          | 'second'
          | 'minute'
          | 'hour'
          | 'day'
          | 'month'
          | 'year'
          | undefined
        roundingMethod?: 'floor' | 'ceil' | 'round' | undefined
        locale?: Locale | undefined
      }
    | undefined
) => {
  if (!date) {
    console.error('date error')
    return ''
  }
  return formatDistanceStrict(new Date(date), new Date(), options)
}

const choseDateFormat = (format: FormatType) => {
  if (format === 'input-datetime') return `yyyy-MM-dd'T'HH:mm`
  if (format === 'input') return `yyyy-MM-dd`
  return format
}

const validDateAsNumber = (date: string | Date | number): number => {
  if (typeof date === 'string') {
    return new Date(date).getTime()
  }
  if (date instanceof Date) {
    return date.getTime()
  }
  if (typeof date === 'number') {
    return date
  }
  return 0
}

export const sortFromNow = (a: any, b: any) => {
  const currentTime = new Date().getTime()
  const aDifference = Math.abs(a?.date - currentTime)
  const baDifference = Math.abs(b?.date - currentTime)
  if (aDifference < baDifference) return -1
  if (aDifference > baDifference) return 1
  return 0
}
