import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { DateType } from '@firebase/types.model.ts/TypeBase.model'
import { addDays } from 'date-fns'
import { fromNow } from 'utils/dates/myDateUtils'

interface PossiblesBirthDates {
  startAt: DateType
  finishAt: DateType
}

const GESTATION_DAYS = 90
export const calculatePossibleBirth = (
  breeding: Partial<AnimalType['breeding']>
): PossiblesBirthDates => {
  const startAt: DateType = addDays(
    breeding?.startAt as unknown as number,
    GESTATION_DAYS
  )
  let finishAt: DateType = addDays(
    breeding?.finishAt as unknown as number,
    GESTATION_DAYS
  )
  return {
    startAt,
    finishAt
  }
}

export const formatBreedingsAsBreedingsList = (
  breedings: Partial<AnimalType['breeding']>[]
): Partial<AnimalType>[] => {
  let animals: Partial<AnimalType>[] = []
  breedings.forEach((breeding) => {
    const possibleBirth = calculatePossibleBirth(breeding)
    const getPlusMinusDays = (date: DateType) => {
      const auxArr = fromNow(date, {
        unit: 'day',
        addSuffix: true
      }).split(' ')
      if (auxArr[0] === 'hace') {
        return -parseInt(auxArr[1])
      } else {
        return parseInt(auxArr[1])
      }
    }
    // @ts-ignore
    const animalsAux: Partial<AnimalType>[] = breeding?.breedingBatch?.map(
      (animal) => {
        return {
          possibleBirthStartIn: getPlusMinusDays(possibleBirth.startAt),
          possibleBirthFinishIn: getPlusMinusDays(possibleBirth.finishAt),
          ...animal,
          breeding: {
            ...breeding,
            possibleBirth
          }
        }
      }
    )
    animals = [...animals, ...animalsAux]
  })
  return animals
}
