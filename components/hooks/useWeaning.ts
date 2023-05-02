import { updateAnimalState } from '@firebase/Animal/main'
import { useState } from 'react'
import { AnimalType } from 'types/base/AnimalType.model'
import useAnimal from './useAnimal'
import useFarmAnimals from './useFarmAnimals'
import useEvent from './useEvent'
import useEvents from './useEvents'
import { FarmEvent } from 'types/base/FarmEvent.model'

const useWeaning = () => {
  const handleWeaning = ({
    animalId,
    eventId
  }: {
    animalId: AnimalType['id']
    eventId: FarmEvent['id']
  }) => {
    //* Update animal state
    //* Update event state
  }
  return { handleWeaning }
}

export default useWeaning
