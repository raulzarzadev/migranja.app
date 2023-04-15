import { deleteEvent } from '@firebase/Events/main'
import { useState } from 'react'
import { FarmEvent } from 'types/base/FarmEvent.model'

const useEvents = () => {
  const [progress, setProgress] = useState(0)
  const handleRevertBirth = async (birthId:) => {

    setProgress(10)
    try {
      // ************************* delete birth event
      //await deleteEvent(birthEvent.id)
      // ************************* delete animals weaning
      // for (let i = 0; i < birthEventData.calfsWeaningsIds.length; i++) {
      //   const weaningId = birthEventData.calfsWeaningsIds[i]
      //   await deleteEvent(weaningId)
      //   setProgress(30 * (i / birthEventData.calfsWeaningsIds.length))
      // }
      // ************************* delete animals
      // for (let i = 0; i < birthEventData.newCalfsIds.length; i++) {
      //   const calfId = birthEventData.newCalfsIds[i]
      //   await deleteAnimal(calfId)
      //   setProgress(70 * (i / birthEventData.newCalfsIds.length))
      // }
      // console.log({
      //   eventId: birthEventData.birthEventId,
      //   eventType: 'PENDING',
      //   animalId: animal.id
      // })
      // ************************* update breeding to pending
      // await updateAnimalStatusInBreedingBatch({
      //   eventId: animal.eventData.id,
      //   eventType: 'PENDING',
      //   animalId: animal.id
      // })
      // ************************* update mom to breeding
      // await updateAnimal(animal.id, { state: 'FREE' })
    } catch (error) {
      console.error(error)
    }

    setProgress(100)
  }
  return { handleRevertBirth, progress }
}

export default useEvents
