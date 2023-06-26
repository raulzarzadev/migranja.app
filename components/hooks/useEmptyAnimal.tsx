import { updateAnimalState } from '@firebase/Animal/main'
import {
  createEvent2,
  updateAnimalStatusInBreedingBatch,
  updateEvent
} from '@firebase/Events/main'
import { AnimalType } from 'types/base/AnimalType.model'
import { FarmEvent } from 'types/base/FarmEvent.model'
import useFarmState from './useFarmState'
import useProgress from './useProgress'
import useAnimal from './useAnimal'
import useFarm from './useFarm'
import useCurrentFarm from './useCurrentFarm'

const useEmptyAnimal = () => {
  const { progress, setProgress } = useProgress()
  const farm = useCurrentFarm()
  const { findParents, findAnimal } = useAnimal()

  const breedingEmptyAnimal = async ({
    breedingId,
    animalId,
    date = new Date(),
    comments = ''
  }: {
    breedingId: FarmEvent['id']
    animalId: AnimalType['id']
    date?: Date
    comments: ''
  }) => {
    try {
      //******************************************************** Update breeding
      setProgress(10)
      await updateAnimalStatusInBreedingBatch({
        eventId: breedingId,
        eventType: 'EMPTY',
        animalId
      })
      // ****************************************************** update animal state
      setProgress(40)
      await updateAnimalState(animalId, 'FREE', 'BREEDING')
      const parents = findParents({ animalId })
      const animal = findAnimal({ animalId })
      // ****************************************************** create event
      setProgress(80)
      await createEvent2({
        type: 'EMPTY',
        farm: farm,
        eventData: {
          date,
          parents,
          comments,
          animal: {
            id: animalId || '',
            earring: animal?.earring || ''
          }
        }
      })
      setProgress(100)
    } catch (error) {
      setProgress(-1)
      console.error(error)
    }
  }

  return {
    breedingEmptyAnimal,
    progress
  }
}

export default useEmptyAnimal
