import { addDays, subDays } from 'date-fns'
import { FarmStateAnimalEvent } from 'store/slices/farmSlice'
import { AnimalType } from 'types/base/AnimalType.model'

export const animalsByStatus = (
  animals: AnimalType[],
  status: AnimalType['currentStatus']
) => animals.filter((animal) => animal.currentStatus === status)

export const animalsByGender = (
  animals: AnimalType[],
  gender: AnimalType['gender']
) => animals.filter((animal) => animal.gender === gender)

export const animalsBetweenDays = (
  animals: AnimalType[],
  startAt = 0,
  endAt = 0
) =>
  animals.filter(({ birthday }) => {
    return (
      birthday < subDays(new Date(), startAt) &&
      birthday > subDays(new Date(), endAt)
    )
  })

export const calculateFarmNumbers = ({
  animals: farmAnimals,
  events
}: {
  animals: AnimalType[]
  events: FarmStateAnimalEvent[]
}) => {
  const activeAnimals = animalsByStatus(farmAnimals, 'ACTIVE')
  const activeFemales = animalsByGender(activeAnimals, 'female')
  const activeMales = animalsByGender(activeAnimals, 'male')

  const malesBetween = (startAt = 0, endAt = 0) =>
    animalsBetweenDays(activeMales, startAt, endAt)
  const femalesBetween = (startAt = 0, endAt = 0) =>
    animalsBetweenDays(activeFemales, startAt, endAt)
  const activeBetween = (startAt = 0, endAt = 0) =>
    animalsBetweenDays(activeAnimals, startAt, endAt)

  const pregnantAnimals = () => {
    const alreadyInBreeding = events
      .filter((event) => event.type === 'BREEDING')
      .map((event) =>
        event.eventData.breedingBatch.filter(
          (animal) => animal.status === 'PENDING'
        )
      )
    return alreadyInBreeding.flat()
  }
  const animalsLactando = (finishWeaning = 0) => {
    // search in events type breeding any animal pending to have birth
    // they count as pregnant evan the fist day that they are un a breeding
    // until they gave birth
    const births = events.filter(
      (event) =>
        event.type === 'BIRTH' &&
        (event.eventData.date as number) >
          subDays(new Date(), finishWeaning).getTime()
    )

    return births.map((birth) =>
      farmAnimals.find(
        (animal) => animal.earring === birth.eventData.parents.mother?.earring
      )
    )
  }

  /**
   * Search animals that drop in for any reason
   * like buy or new acquisition
   */
  const dropInAnimals = [...events.filter((event) => event.type === 'DROP_IN')]
  /**
   * Search animals that drop out for any reason
   * like dead or has been stolen , or lost
   */
  const dropOutAnimals = [
    ...events.filter((event) => event.type === 'DROP_OUT')
  ]

  /**
   * Search al birhts
   */
  const births = [...events.filter((event) => event.type === 'BIRTH')]
  /**
   * Search calf that born
   */
  const newCalfs = [
    ...births
      .filter((event) => event.type === 'BIRTH')
      .map((event) => event.eventData.calfs)
  ].flat()
  /**
   * Search dead events
   */
  const deads = [...events].filter((event) => event.type === 'DROP_OUT')
  const birthsLastMonth = [...births].filter(
    (event) =>
      (event.eventData.date as number) > addDays(new Date(), -30).getTime()
  )
  const newCalfsLastMonth = [
    ...birthsLastMonth.map((event) => event.eventData.calfs)
  ].flat()

  return {
    activeAnimals,
    activeFemales,
    activeMales,
    activeBetween,
    malesBetween,
    femalesBetween,
    pregnantAnimals,
    animalsLactando,
    dropOutAnimals,
    dropInAnimals,
    births,
    newCalfs,
    birthsLastMonth,
    newCalfsLastMonth,
    deads
  }
}
