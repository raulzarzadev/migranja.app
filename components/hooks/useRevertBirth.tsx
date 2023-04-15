import {
  deleteEvent,
  updateAnimalStatusInBreedingBatch
} from '@firebase/Events/main'
import { useState } from 'react'
import { FarmEvent } from 'types/base/FarmEvent.model'
import useEvent from './useEvent'
import { useSelector } from 'react-redux'
import { selectFarmEvents } from 'store/slices/farmSlice'
import { AnimalWeaningEvent } from 'types/base/AnimalWeaning.model'
import { deleteAnimal, updateAnimal } from '@firebase/Animal/main'

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
  const { event } = useEvent({ eventId: birthId })

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
    const promises = weaning.map((event) => deleteEvent(event.id))
    return await Promise.all(promises)
  }

  const deleteCalfs = async (calfs: Calf[] = []) => {
    for (let i = 0; i < calfs?.length; i++) {
      const calfId = calfs[i].id
      await deleteAnimal(calfId)
    }
  }

  //const breedingId = ''
  const handleRevertBirth = async () => {
    setProgress(10)
    const calfs = event?.eventData.calfs?.map((calf) => ({
      id: calf.id || '',
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

      // ************************* update breeding to pending
      await updateAnimalStatusInBreedingBatch({
        eventId: breedingId,
        eventType: 'PENDING',
        animalId: motherId
      })
      setProgress(80)

      // ************************* update mom to breeding
      await updateAnimal(motherId as string, { state: 'FREE' })
      setProgress(100)
    } catch (error) {
      setProgress(0)
      console.error(error)
    }
  }
  return { handleRevertBirth, progress }
}

export default useRevertBirth
