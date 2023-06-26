import { BreedingEventType } from '@firebase/Events/event.model'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { DateType, Merge } from '@firebase/types.model.ts/TypeBase.model'
import { addDays } from 'date-fns'
import { OVINE_DAYS } from 'FARM_CONFIG/FARM_DATES'
import {
  AnimalBreedingType,
  BreedingDetailsEvent,
  EventDataStoreDetails,
  SetGenericEventType,
  ShortParentsType
} from 'types/base/FarmEvent.model'
import { fromNow } from 'utils/dates/myDateUtils'

export interface PossiblesBirthDates {
  startAt: number | Date
  finishAt: number | Date
}

const GESTATION_DAYS = OVINE_DAYS.gestation
export const calculatePossibleBirth = (
  {
    breedingStartAt,
    breedingFinishAt
  }: {
    breedingStartAt: number | Date
    breedingFinishAt: number | Date
  },
  options?: { asNumber?: boolean }
): PossiblesBirthDates => {
  if (options?.asNumber) {
    return {
      startAt: addDays(breedingStartAt, GESTATION_DAYS).getTime(),
      finishAt: addDays(breedingFinishAt, GESTATION_DAYS).getTime()
    }
  }
  const birthsStartAt: Date | number =
    breedingStartAt && addDays(breedingStartAt, GESTATION_DAYS)
  let birthsFinishAt: DateType =
    breedingFinishAt && addDays(breedingFinishAt, GESTATION_DAYS)

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

export const calculatePossibleBirthStartAndFinish = ({
  startAt,
  finishAt,
  otherMales
}: {
  startAt: number | Date
  finishAt: number | Date
  otherMales?: any[]
}): BreedingDatesType => {
  let _finishAt = finishAt

  //* Determinate if other males exist in breeding and define possible birth dates in that
  if (!!otherMales?.length) {
    const otherMalesFinishBreedingFinishAt = otherMales?.at(-1)?.finishAt
    _finishAt = otherMalesFinishBreedingFinishAt
  }

  const possibleBirth = calculatePossibleBirth(
    {
      breedingFinishAt: _finishAt,
      breedingStartAt: startAt
    },
    { asNumber: true }
  )

  const possibleBirthStartIn =
    possibleBirth && getPlusMinusDays(possibleBirth?.startAt)
  const possibleBirthFinishIn =
    possibleBirth && getPlusMinusDays(possibleBirth?.finishAt)

  return {
    breedingStartAt: startAt,
    breedingFinishAt: _finishAt,
    birthStartAt: possibleBirth.startAt,
    birthFinishAt: possibleBirth.finishAt,
    birthStartInDays: possibleBirthStartIn,
    birthFinishInDays: possibleBirthFinishIn
  }
}

export interface BreedingDatesType {
  breedingStartAt: number | Date
  breedingFinishAt: number | Date
  birthStartAt: number | Date
  birthFinishAt: number | Date
  birthStartInDays: number
  birthFinishInDays: number
}

export interface AnimalFormatted extends Merge<AnimalType, BreedingDatesType> {
  breedingDates: BreedingDatesType
}
export interface BreedingFormatted {
  breedingDates: BreedingDatesType
  breedingBatch: AnimalBreedingType[]
  breedingId: string
  breedingMale?: Partial<AnimalType> | null
  parents?: ShortParentsType | null
  date: string | number
}
export const formatBreedingsGenericEvent = (
  breedings: EventDataStoreDetails[]
): BreedingFormatted[] => {
  return breedings.map(
    (
      breeding: SetGenericEventType<BreedingDetailsEvent>
    ): BreedingFormatted => {
      const {
        eventData: {
          breedingBatch,
          breedingId,
          breedingMale,
          finishAt,
          startAt,
          parents,
          date
        }
      } = breeding

      const possibleBirth = calculatePossibleBirth({
        breedingFinishAt: finishAt as number,
        breedingStartAt: startAt as number
      })
      const breedingDates: BreedingDatesType = {
        birthStartAt: possibleBirth?.startAt,
        birthFinishAt: possibleBirth?.finishAt,
        birthStartInDays: getPlusMinusDays(possibleBirth?.startAt),
        birthFinishInDays: getPlusMinusDays(possibleBirth?.finishAt),
        breedingStartAt: possibleBirth.startAt,
        breedingFinishAt: possibleBirth.finishAt
      }
      const formattedBreeding: BreedingFormatted = {
        breedingBatch,
        breedingDates,
        breedingId,
        breedingMale,
        parents,
        date: date || ''
      }

      return formattedBreeding
    }
  )
}
