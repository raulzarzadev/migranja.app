import { BreedingEventType } from '@firebase/Events/event.model'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { DateType } from '@firebase/types.model.ts/TypeBase.model'
import { BreedingCard } from 'components/BreedingBatches'
import { addDays } from 'date-fns'
import { fromNow } from 'utils/dates/myDateUtils'

export interface PossiblesBirthDates {
  startAt: number | Date
  finishAt: number | Date
}

const GESTATION_DAYS = 150
export const calculatePossibleBirth = ({
  breedingStartAt,
  breedingFinishAt
}: {
  breedingStartAt?: number | Date
  breedingFinishAt?: number | Date
}): PossiblesBirthDates => {
  const birthsStartAt: DateType =
    (breedingStartAt && addDays(breedingStartAt, GESTATION_DAYS)) || 0
  let birthsFinishAt: DateType =
    (breedingFinishAt && addDays(breedingFinishAt, GESTATION_DAYS)) || 0
  return {
    startAt: birthsStartAt,
    finishAt: birthsFinishAt
  }
}
export const getPlusMinusDays = (date?: Date | number) => {
  if (!date) return 0
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

export const formatBreedingBatches = ({
  breedings
}: {
  breedings: BreedingEventType[]
}): BreedingCard[] => {
  const breedingsFormatted: BreedingCard[] = breedings.map(
    ({
      id,
      breedingMale,
      startAt,
      finishAt,
      breedingBatch,
      breedingAborts,
      breedingBirths,
      breedingEmpty
    }) => {
      const possibleBirthDates = calculatePossibleBirth({
        breedingFinishAt: startAt,
        breedingStartAt: finishAt
      })
      const possibleBirthFinishIn = getPlusMinusDays(finishAt)
      const possibleBirthStartIn = getPlusMinusDays(startAt)
      return {
        breedingBatch,
        breedingMale,
        finishAt,
        id,
        possibleBirthDates,
        possibleBirthFinishIn,
        possibleBirthStartIn,
        startAt,
        breedingAborts,
        breedingBirths,
        breedingEmpty
      }
    }
  )
  return breedingsFormatted
}

export const formatBreedingsAsBreedingsList = (
  breedings: Partial<AnimalType['breeding']>[]
): Partial<AnimalType>[] => {
  let animals: Partial<AnimalType>[] = []
  breedings.forEach((breeding) => {
    const possibleBirth = calculatePossibleBirth({
      breedingFinishAt: breeding?.startAt,
      breedingStartAt: breeding?.finishAt
    })

    // @ts-ignore
    const animalsAux: Partial<AnimalType>[] = breeding?.breedingBatch?.map(
      (animal) => {
        return {
          possibleBirthStartIn:
            possibleBirth && getPlusMinusDays(possibleBirth?.startAt),
          possibleBirthFinishIn:
            possibleBirth && getPlusMinusDays(possibleBirth?.finishAt),
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
