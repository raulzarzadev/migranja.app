import { EventType } from '@firebase/Events/event.model'
import {
  AnimalType,
  ParentsType
} from '@firebase/types.model.ts/AnimalType.model'
import { Merge } from '@firebase/types.model.ts/TypeBase.model'
import {
  AbortDetailsEvent,
  BirthDetailsEvent,
  BreedingDetailsEvent,
  EmptyDetailsEvent
} from 'components/FarmEvents/FarmEvent/FarmEvent.model'
import { ParentType } from 'types/base/AnimalType.model'
import {
  DTO_CreateBreedingEventType,
  EventData
} from 'types/base/FarmEvent.model'
import { BreedingFormatted } from '../breeding.helpers'
export interface CreateBirthDataType {
  eventType: EventType['type']
  currentFarm: any
  farmAnimals: Partial<AnimalType>[]
  animal: any
  formValues: any
  calfs: any[]
}
export interface DataToFormatGenericEventType<T> {
  eventType: EventType['type']
  currentFarm: any
  farmAnimals: Partial<AnimalType>[]
  animal: any
  breeding?: {
    breedingId?: string
    breedingMale?: ParentType | null
  }
  formValues: any
  calfs: any[]
}

export function formatNewGenericFarmEvent<T>(
  data: DataToFormatGenericEventType<T>
): {
  formatBirthEvent: DTO_CreateBreedingEventType
} {
  const currentFarm = data.currentFarm
  const animal = data.animal
  const formValues = data.formValues
  const farmAnimals = data.farmAnimals
  const eventType = data.eventType
  const breeding = data.breeding

  const motherLastVersion =
    farmAnimals?.find(({ id }) => id == animal.id) || animal

  const fatherLastVersion =
    farmAnimals?.find(({ id }) => id == breeding?.breedingMale?.id) ||
    breeding?.breedingMale

  const parentsDefaultData: AnimalType['parents'] = {
    father: {
      breed: fatherLastVersion?.breed || '',
      earring: fatherLastVersion?.earring || '',
      name: fatherLastVersion?.name || '',
      id: fatherLastVersion?.id || '',
      inTheFarm: true
    },
    mother: {
      breed: motherLastVersion?.breed || '',
      earring: motherLastVersion?.earring || '',
      name: motherLastVersion?.name || '',
      id: motherLastVersion?.id || '',
      inTheFarm: true
    }
  }
  const breedingBatchId = breeding?.breedingId
  const defaultBirthValues: Partial<AnimalType> = {
    birthday: formValues.date || new Date(),
    birthType: formValues.birthType || 1,
    type: 'ovine',
    name: '',
    batch: breedingBatchId || '',
    gender: formValues?.gender || 'female',
    farm: {
      id: currentFarm?.id,
      name: currentFarm?.name
    },
    parents: parentsDefaultData
  }
  const motherBreed = parentsDefaultData.mother?.breed?.replaceAll(' ', '')
  const fatherBreed = parentsDefaultData.father?.breed?.replaceAll(' ', '')
  const breed =
    !motherBreed || !fatherBreed
      ? motherBreed || fatherBreed
      : fatherBreed === motherBreed
      ? fatherBreed
      : `(1/2${motherBreed}-1/2${fatherBreed})`

  const formattedCalfs = data?.calfs?.map((calf: any) => {
    const statuses: AnimalType['statuses'] = {
      isAlive: !!calf?.isAlive,
      isInTheFarm: !!calf?.isAlive,
      isPregnant: false,
      isSold: false
    }

    const calfFormatted = {
      ...defaultBirthValues,
      earring: calf.earring,
      breed: breed?.replaceAll(' ', ''),
      birthType: data?.calfs?.length,
      gender: calf.gender,
      statuses,
      currentStatus: !!calf?.isAlive ? 'ACTIVE' : 'DEAD',
      weight: {
        ...calf.weight
      }
    }
    return calfFormatted
  })

  const eventData = formatEventData<EventData>(eventType, {
    ...formValues,
    date: formValues.date,
    parents: parentsDefaultData,
    calfs: formattedCalfs,
    batch: breeding?.breedingId,
    breedingId: breeding?.breedingId
  })

  const formatBirthEvent: DTO_CreateBreedingEventType = {
    type: eventType,
    eventData,
    farm: {
      id: currentFarm?.id || '',
      name: currentFarm?.name || ''
    }
  }

  return { formatBirthEvent }
}

type EventDataDetails = Merge<
  Merge<BreedingDetailsEvent, AbortDetailsEvent>,
  BirthDetailsEvent
>
function formatEventData<T>(
  eventType: EventType['type'],
  eventData: EventDataDetails
): T {
  const {
    date,
    parents,
    batch,
    comments,
    startAt,
    finishAt,
    birthType,
    calfs,
    breedingId,
    breedingMale,
    breedingBatch
  } = eventData

  if (eventType === 'ABORT') {
    const data: AbortDetailsEvent = {
      date,
      parents,
      batch,
      comments,
      breedingId
    }
    return data as T
  }
  if (eventType === 'BREEDING') {
    const data: BreedingDetailsEvent = {
      parents,
      breedingBatch,
      breedingMale,
      startAt,
      finishAt,
      breedingId,
      date
    }
    return data as T
  }
  if (eventType === 'BIRTH') {
    const data: BirthDetailsEvent = {
      batch,
      birthType,
      calfs,
      date,
      parents,
      breedingId
    }
    return data as T
  }
  if (eventType === 'EMPTY') {
    const data: EmptyDetailsEvent = {
      batch,
      date,
      parents,
      comments,
      breedingId
    }
    return data as T
  }
  if (eventType === 'REMOVE') {
    console.log('not remove event tye valid')
    return {} as T
  }
  console.log('no event tye valid')
  return {} as T
}
