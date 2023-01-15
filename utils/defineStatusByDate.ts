import { addDays, subDays } from 'date-fns'

export const defineStatusByDate = (
  date: number,
  warningMarginDays: number = 5
): 'success' | 'error' | 'warning' | null => {
  const days = warningMarginDays
  const plusMinusDaysInMs = days * 24 * 60 * 60 * 1000
  const now = new Date().getTime()

  if (date > now + plusMinusDaysInMs) return 'success'
  if (date < now - plusMinusDaysInMs) return 'error'
  if (date <= now + plusMinusDaysInMs) return 'warning'

  return null
}
