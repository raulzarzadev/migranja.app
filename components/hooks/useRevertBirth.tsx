import {
  deleteEvent,
  updateAnimalStatusInBreedingBatch
} from '@firebase/Events/main'
import { useState } from 'react'
import { FarmEvent } from 'types/base/FarmEvent.model'
import useEvent from './useEvent'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmEvents } from 'store/slices/farmSlice'
import { AnimalWeaningEvent } from 'types/base/AnimalWeaning.model'
import { deleteAnimal, updateAnimal } from '@firebase/Animal/main'
import { createError } from '@firebase/Errors/main'

const useRevertBirth = ({
  birthId,
  breedingId,
  motherId
}: {
  birthId: FarmEvent['id']
  breedingId: string
  motherId: string
}) => {
  const [progress, setProgress] = useState(0)

  const farmEvents = useSelector(selectFarmEvents)
  const farmAnimals = useSelector(selectFarmAnimals)

  const birthEvent = farmEvents.find((e) => e.id === birthId)
  const breedingEvent = farmEvents.find((e) => e.id === breedingId)
  const mother = farmAnimals.find((a) => a.id === motherId)

  interface Calf {
    id: string
    earring: string
  }

  const deleteCalfsWeaning = async (calfs?: Calf[]) => {
    const weaning: AnimalWeaningEvent[] = []

    calfs?.forEach((calf) => {
      //* Find all earring weaning
      const events = farmEvents.filter(
        ({ type, eventData }) =>
          type === 'WEANING' &&
          eventData.status === 'PENDING' &&
          eventData.earring === calf.earring
      )
      //* Add  events to delete
      events.forEach((e) => {
        weaning.push(e)
      })
    })
    const promises = weaning.map((birthEvent) => deleteEvent(birthEvent.id))

    return await Promise.all(promises).catch((err) => console.log({ err }))
  }

  const deleteCalfs = async (calfs: Calf[] = []) => {
    console.log({ calfs })
    try {
      for (let i = 0; i < calfs?.length; i++) {
        const calfId = calfs[i].id
        if (!calfId) return console.log('no calf id')
        await deleteAnimal(calfId).then((res) => {
          console.log(res)
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  //const breedingId = ''

  const handleRevertBirth = async () => {
    setProgress(10)

    const calfs = birthEvent?.eventData.calfs?.map((calf) => ({
      id:
        calf.id ||
        farmAnimals.find((a) => a.earring === calf.earring)?.id ||
        '',
      earring: calf.earring || ''
    }))

    try {
      // ************************* delete birth event
      await deleteEvent(birthId)
      setProgress(20)
      // ************************* delete animals weaning
      await deleteCalfsWeaning(calfs)
      setProgress(40)
      // ************************* delete animals
      await deleteCalfs(calfs)
      setProgress(50)

      // ************************* update breeding to pending if ids are provided
      if (breedingEvent?.id && mother?.id) {
        await updateAnimalStatusInBreedingBatch({
          eventId: breedingEvent?.id,
          eventType: 'PENDING',
          animalId: mother?.id
        })
      }
      setProgress(80)

      // ************************* update mom to breeding
      if (mother?.id) {
        await updateAnimal(mother?.id as string, { state: 'FREE' })
      }
      setProgress(100)
    } catch (error) {
      createError('CreateRevertBirthError', error)
      setProgress(0)
      console.error(error)
    }
  }
  return { handleRevertBirth, progress }
}

export default useRevertBirth
