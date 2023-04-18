import { AnimalType, ParentsType } from 'types/base/AnimalType.model'
import useAnimal from './useAnimal'
import useEvent from './useEvent'
import { EventType } from '@firebase/Events/event.model'
import { useState } from 'react'
import {
  createBirthEvent,
  createEvent,
  createEvent_v2,
  updateEventBreedingBatch
} from '@firebase/Events/main'
import { DateType } from 'types/base/TypeBase.model'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmState } from 'store/slices/farmSlice'
import { createAnimal, updateAnimalState } from '@firebase/Animal/main'
import { creteAnimalWeaning } from '@firebase/Events/weaning.event'
import { OVINE_DAYS } from 'FARM_CONFIG/FARM_DATES'
import { addDays } from 'date-fns'
import { NewAnimal } from '@comps/AnimalsForm'

export interface DTO_NewBirth {
  type: EventType['type']
  farm: EventType['farm']
  eventData: {
    date: DateType
    batch: string
    breeding: {
      id: EventType['id']
      name: string
    } | null
    calfs: NewCalf[]
    parents: ParentsType
  }
}
export interface NewCalf extends NewAnimal {}
const useCreateBirth = ({ breedingId }: { breedingId?: string } = {}) => {
  // const { animal: mother } = useAnimal({ animalId: motherId })
  // const { animal: father } = useAnimal({ animalId: fatherId })
  const { event } = useEvent({ eventId: breedingId || '' })
  const farmAnimals = useSelector(selectFarmAnimals)
  const farm = useSelector(selectFarmState)
  const [fatherEarring, setFatherEarring] = useState()
  const [motherEarring, setMotherEarring] = useState()
  const [date, setDate] = useState<DateType>(new Date())
  const [batch, setBatch] = useState('')
  const [status, setStatus] = useState('ready')
  const [progress, setProgress] = useState(0)
  const [calfs, setCalfs] = useState<DTO_NewBirth['eventData']['calfs']>([])
  const parentsData = useParentsData({ motherEarring, fatherEarring })

  const breedingData = event
    ? {
        id: event?.id || '',
        name: event?.eventData.batchId || ''
      }
    : null
  const { animal: motherData } = useAnimal({ animalId: parentsData.mother?.id })

  const handleCreateBirth = async (data: {
    batch?: string
    breeding: { id: string; name: string }
    calfs: []
    date: DateType
    fatherId: string
    motherId: string
  }) => {
    const parentsData = () => {
      const father = farmAnimals.find(({ id }) => id === data.fatherId)
      const mother = farmAnimals.find(({ id }) => id === data.motherId)
      return {
        father: father
          ? {
              id: father?.id,
              earring: father?.earring,
              inTheFarm: true
            }
          : null,
        mother: mother
          ? {
              id: mother?.id,
              earring: mother?.earring,
              inTheFarm: true
            }
          : null
      }
    }
    const newBirth: DTO_NewBirth = {
      type: 'BREEDING',
      farm: farm!,
      eventData: {
        date,
        batch,
        breeding: breedingData,
        calfs: data.calfs,
        parents: parentsData()
      }
    }
    setProgress(10)
    setStatus('CREATING_EVENT')

    console.log({ newBirth })

    try {
      // *************************************************  1. create birth
      await createEvent_v2(newBirth)
      setProgress(20)
      setStatus('CREATING_ANIMALS')

      // *************************************************  2. create animals/calfs
      const newAnimalsPromises = calfs.map((calf) => {
        return createAnimal({ ...calf, state: 'LACTATING' })
      })
      const calfsCreated = await Promise.all(newAnimalsPromises)
      setProgress(40)
      setStatus('CREATING_WEANING')

      // *************************************************  3. create animals weaning
      const newWeaningsPromises = calfs.map((calf) => {
        return creteAnimalWeaning({
          type: 'WEANING',
          eventData: {
            status: 'PENDING',
            earring: calf.earring || '',
            date: addDays(date, OVINE_DAYS.finishWeaning).getTime()
          },
          farm: {
            id: farm?.id || '',
            name: farm?.name || ''
          }
        })
      })
      const weaningCreated = await Promise.all(newWeaningsPromises)
      setProgress(60)
      setStatus('UPDATING_BREEDING')

      // *************************************************  4. update breeding, move from batch to already done
      const birthEventData = {
        birthEventId: event?.id || '',
        newCalfsIds: calfsCreated.map((animal) => animal?.res?.id),
        calfsWeaningsIds: weaningCreated.map((weaning) => weaning?.res.id)
      }
      const breeding = await updateEventBreedingBatch({
        eventId: event?.id || '',
        animalId: parentsData.mother?.id as string,
        eventType: 'BIRTH',
        birthEventData
      })
      setProgress(80)
      setStatus('UPDATING_MOTHER_STATE')

      // *************************************************  5. update mom state to SUCKLE
      if (motherData?.id)
        await updateAnimalState(motherData?.id, 'SUCKLE', motherData?.state)
      setProgress(100)
      setStatus('DONE')
    } catch (error) {
      setProgress(0)
      setStatus('ERROR')
      console.error(error)
    }
  }
  return {
    handleCreateBirth,
    setFatherEarring,
    setMotherEarring,
    setBatch,
    progress,
    status
  }
}

const useParentsData = ({
  fatherEarring,
  motherEarring
}: {
  fatherEarring?: AnimalType['earring']
  motherEarring?: AnimalType['earring']
}): ParentsType => {
  const farmAnimals = useSelector(selectFarmAnimals)
  const mother = motherEarring
    ? farmAnimals.find((animal) => animal.earring === motherEarring)
    : null
  const father = motherEarring
    ? farmAnimals.find((animal) => animal.earring === fatherEarring)
    : null

  const motherData: ParentsType['mother'] | null = mother
    ? {
        inTheFarm: !!mother,
        name: mother?.name,
        id: mother?.id,
        earring: mother?.earring
      }
    : null

  const fatherData: ParentsType['mother'] | null = father
    ? {
        inTheFarm: !!mother,
        name: mother?.name,
        id: mother?.id,
        earring: mother?.earring
      }
    : null

  return { mother: motherData, father: fatherData }
}

export default useCreateBirth
