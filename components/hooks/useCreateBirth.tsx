import { AnimalType, ParentsType } from 'types/base/AnimalType.model'
import useAnimal from './useAnimal'
import useEvent from './useEvent'
import { EventType } from '@firebase/Events/event.model'
import { useEffect, useState } from 'react'
import {
  createBirthEvent,
  createEvent,
  createEvent2,
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
const useCreateBirth = ({
  breedingId,
  motherId,
  fatherId
}: { breedingId?: string; fatherId?: string; motherId?: string } = {}) => {
  const farm = useSelector(selectFarmState)
  const { event } = useEvent({ eventId: breedingId || '' })
  const farmAnimals = useSelector(selectFarmAnimals)
  const [motherData, setMotherData] = useState<AnimalType | null>(null)
  const [fatherData, setFatherData] = useState<AnimalType | null>(null)

  useEffect(() => {
    const mother = farmAnimals.find(({ id }) => id === motherId) || null
    const father = farmAnimals.find(({ id }) => id === fatherId) || null
    setMotherData(mother)
    setFatherData(father)
  }, [fatherId, motherId])

  const [date, setDate] = useState<DateType>(new Date())
  const [batch, setBatch] = useState('')
  const [status, setStatus] = useState('ready')
  const [progress, setProgress] = useState(0)
  const [calfs, setCalfs] = useState<DTO_NewBirth['eventData']['calfs']>([])

  const breedingData = event
    ? {
        id: event?.id || '',
        name: event?.eventData.batchId || ''
      }
    : null

  const handleCreateBirth = async (data: {
    batch?: string
    breeding: { id: string; name: string }
    calfs: []
    date: DateType
  }) => {
    const newBirth: DTO_NewBirth = {
      type: 'BIRTH',
      farm: farm!,
      eventData: {
        date,
        batch,
        breeding: breedingData,
        calfs: data.calfs,
        parents: {
          father: fatherData
            ? {
                inTheFarm: true,
                earring: fatherData.earring,
                id: fatherData.id,
                name: fatherData.name
              }
            : null,
          mother: motherData
            ? {
                inTheFarm: true,
                earring: motherData.earring,
                id: motherData.id,
                name: motherData.name
              }
            : null
        }
      }
    }
    setProgress(10)
    setStatus('CREATING_EVENT')

    console.log({ newBirth })

    try {
      // *************************************************  1. create birth
      await createEvent2(newBirth)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => console.log(err))
      setProgress(20)
      setStatus('CREATING_ANIMALS')

      // *************************************************  2. create animals/calfs
      const newAnimalsPromises = calfs.map(async (calf) => {
        try {
          const res = await createAnimal({ ...calf, state: 'LACTATING' })
          return console.log(res)
        } catch (err) {
          return console.log(err)
        }
      })
      console.log({ newAnimalsPromises })
      const calfsCreated = await Promise.all(newAnimalsPromises)
      setProgress(40)
      console.log('animals created')
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
        animalId: motherData?.id as string,
        eventType: 'BIRTH',
        birthEventData
      })
      setProgress(80)
      setStatus('UPDATING_MOTHER_STATE')

      // *************************************************  5. update mom state to SUCKLE
      if (motherId)
        await updateAnimalState(motherId, 'SUCKLE', motherData?.state)
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
    setBatch,
    progress,
    status
  }
}

export default useCreateBirth
