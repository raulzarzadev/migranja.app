import { subDays } from 'date-fns'
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

export const calculateFarmNumbers = (farmAnimals: AnimalType[]) => {
  const activeAnimals = animalsByStatus(farmAnimals, 'ACTIVE')
  const activeFemales = animalsByGender(activeAnimals, 'female')
  const activeMales = animalsByGender(activeAnimals, 'male')

  const malesBetween = (startAt = 0, endAt = 0) =>
    animalsBetweenDays(activeMales, startAt, endAt)
  const femalesBetween = (startAt = 0, endAt = 0) =>
    animalsBetweenDays(activeFemales, startAt, endAt)
  const activeBetween = (startAt = 0, endAt = 0) =>
    animalsBetweenDays(activeAnimals, startAt, endAt)
  return {
    activeAnimals,
    activeFemales,
    activeMales,
    activeBetween,
    malesBetween,
    femalesBetween
  }
}
