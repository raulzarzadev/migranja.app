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
        breedingFinishAt: finishAt,
        breedingStartAt: startAt
      })
      const possibleBirthFinishIn = getPlusMinusDays(
        possibleBirthDates.finishAt
      )
      const possibleBirthStartIn = getPlusMinusDays(possibleBirthDates.startAt)
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

export interface BatchFormatted extends BreedingEventType {
  animals: Partial<AnimalType>[]
  breedingDates: {
    breedingStartAt: number | Date
    breedingFinishAt: number | Date
    birthStartAt: number | Date
    birthFinishAt: number | Date
    birthStartInDays: number
    birthFinishInDays: number
  }
}

export const formatAnimalsBreedings = (
  breedings: BreedingEventType[]
): BatchFormatted[] => {
  return breedings.map((breeding) => {
    const possibleBirth = calculatePossibleBirth({
      breedingFinishAt: breeding.finishAt,
      breedingStartAt: breeding.startAt
    })
    const breedingDates = {
      breedingStartAt: breeding.startAt,
      breedingFinishAt: breeding.finishAt,
      birthStartAt: possibleBirth.startAt,
      birthFinishAt: possibleBirth.finishAt,
      birthStartInDays: getPlusMinusDays(possibleBirth.startAt),
      birthFinishInDays: getPlusMinusDays(possibleBirth.finishAt)
    }
    const breedingBatch = breeding.breedingBatch.map((animal) => {
      return {
        ...animal,
        ...breedingDates,
        breedingDates,
        status: 'AWAITING'
      }
    })
    const breedingBirths = breeding?.breedingBirths?.map((animal) => {
      return {
        ...animal,
        ...breedingDates,
        breedingDates,
        status: 'BIRTH'
      }
    })
    const breedingAborts = breeding?.breedingAborts?.map((animal) => {
      return {
        ...animal,
        ...breedingDates,
        breedingDates,
        status: 'ABORT'
      }
    })
    const breedingEmpty = breeding?.breedingEmpty?.map((animal) => {
      return {
        ...animal,
        ...breedingDates,
        breedingDates,
        status: 'EMPTY'
      }
    })
    const animals = [
      ...breedingBatch,
      ...(breedingBirths || []),
      ...(breedingAborts || []),
      ...(breedingEmpty || [])
    ].map((animal) => {
      return { ...animal, breeding }
    })
    return {
      ...breeding,
      breedingDates,
      animals,
      breedingBatch: breedingBatch
    }
  })
}
