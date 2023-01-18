import { subDays } from 'date-fns'
import FARM_DATES from 'FARM_CONFIG/FARM_DATES'
import { FarmStateAnimalEvent } from 'store/slices/farmSlice'
import { AnimalType } from 'types/base/AnimalType.model'
import { FarmEvent } from 'types/base/FarmEvent.model'

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
        event.eventData.date > subDays(new Date(), finishWeaning).getTime()
    )

    return births.map((birth) =>
      farmAnimals.find(
        (animal) => animal.earring === birth.eventData.parents.mother?.earring
      )
    )
  }
  return {
    activeAnimals,
    activeFemales,
    activeMales,
    activeBetween,
    malesBetween,
    femalesBetween,
    pregnantAnimals,
    animalsLactando
  }
}
