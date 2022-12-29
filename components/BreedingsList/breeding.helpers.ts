import { DateType } from '@firebase/types.model.ts/TypeBase.model'
import { addDays } from 'date-fns'
import { BreedingType } from '.'

interface PossiblesBirthDates {
  startAt: DateType
  finishAt: DateType
}

const GESTATION_DAYS = 90
export const calculatePossibleBirth = (
  breeding: Partial<BreedingType['breeding']>
): PossiblesBirthDates => {
  const startAt: DateType = addDays(breeding.startAt, GESTATION_DAYS)
  let finishAt: DateType = addDays(breeding.finishAt, GESTATION_DAYS)
  return {
    startAt,
    finishAt
  }
}
