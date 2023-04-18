import { getAuth } from 'firebase/auth'
import { arrayRemove, arrayUnion, limit, where } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { FirebaseCRUD } from '../firebase.CRUD.ts'
import { app, db } from '../main'
import {
  EventDTO,
  CreateEventDTO,
  BreedingEventType,
  EventType
} from './event.model'

import { AnimalType } from 'firebase/types.model.ts/AnimalType.model'
import { CreateGenericEventType } from 'components/FarmEvents/FarmEvent/FarmEvent.model'
import {
  BaseFarmEvent,
  BirthDetailsEvent,
  EventData
} from 'types/base/FarmEvent.model'
import { BirthEventDataType } from 'types/base/BirtEventDataType.model'
import { DateType } from 'types/base/TypeBase.model.js'
import { ParentsType } from 'types/base/AnimalType.model.js'
const storage = getStorage(app)
const TARGET_FORMAT_DATE = 'number'

export const eventsCRUD = new FirebaseCRUD(
  'events',
  db,
  storage,
  TARGET_FORMAT_DATE
)

/** ************** CREATE ********** */

export const createEvent = async (newItem: CreateEventDTO) =>
  await eventsCRUD.createItem(newItem)

/** ************** UPDATE ********** */
export const updateEvent = async (itemId: string, newItem: EventDTO) =>
  await eventsCRUD.updateItem(itemId, newItem)

/** ************** DELETE ********** */
export const deleteEvent = async (itemId: string) =>
  await eventsCRUD.deleteItem(itemId)

/** ************** GET ********** */

export const getEvent = async (itemId: string) =>
  await eventsCRUD.getItem(itemId)

/** ************** GET ********** */

export const getFarmBreedings = async (farmId: string) =>
  await eventsCRUD.getItems([
    where('farm.id', '==', farmId),
    where('type', '==', 'BREEDING')
  ])

/** ************** LISTEN ONE ********** */

export const listenEvent = async (itemId: string, cb: CallableFunction) =>
  await eventsCRUD.listenItem(itemId, cb)

/** ************** LISTEN CURRENT USER ********** */
export const listenUserEvents = async (cb: CallableFunction) => {
  const currentUserId = getAuth().currentUser?.uid
  return await eventsCRUD.listenItems(
    [where('userId', '==', currentUserId)],
    cb
  )
}

/** ************** LISTEN FARM BREEDINGS ********** */

export const listenFarmBreedings = async (
  farmId: string,
  cb: CallableFunction
) =>
  await eventsCRUD.listenItems(
    [where('farm.id', '==', farmId), where('type', '==', 'BREEDING')],
    cb
  )

export const createTypedEvent = async <T>(newItem: CreateGenericEventType<T>) =>
  await eventsCRUD.createItem({ ...newItem })

/** ************** CREATE GENERIC BIRTH EVENT ********** */
export const createBirthEvent = async (
  newItem: CreateGenericEventType<BirthDetailsEvent>
) => await eventsCRUD.createItem({ ...newItem })

export const createGenericBreedingEvent = async <T>(
  newItem: CreateGenericEventType<T>
) => await eventsCRUD.createItem({ ...newItem })

/** ************** EDIT BREEDING EVENT, REMOVE ANIMAL FROM BREEDING BATCH, AND ADD TO BREEDING BIRTHS ********** */
export const updateEventBreedingBatch = async ({
  eventId,
  animalId,
  eventType,
  birthEventData
}: {
  eventId: string
  animalId: string
  eventType: BaseFarmEvent['type']
  birthEventData?: BirthEventDataType
}) => {
  const oldAnimal = await eventsCRUD.getItem(eventId).then((res) => {
    // @ts-ignore
    return res?.eventData?.breedingBatch.find(
      (animal: { id: string }) => animal?.id === animalId
    )
  })
  const removeOldAnimal = await eventsCRUD.updateItem(eventId, {
    'eventData.breedingBatch': arrayRemove(oldAnimal)
  })
  const newAnimal = {
    ...oldAnimal,
    status: eventType,
    birthEventData
  }
  const setNewAnimal = await eventsCRUD.updateItem(eventId, {
    'eventData.breedingBatch': arrayUnion(newAnimal)
  })
  return await Promise.all([oldAnimal, removeOldAnimal, setNewAnimal])
}

export const updateBreedingEventBatch = async ({
  animalId,
  eventType,
  eventData
}: {
  animalId?: string
  eventType: BaseFarmEvent['type']
  eventData: any
}) => {
  const oldAnimal = [...(eventData?.breedingBatch || [])].find(
    (animal) => animal?.id === animalId
  )
  console.log({ oldAnimal, eventType, eventData })

  // const removeOldAnimal = await eventsCRUD.updateItem(eventId, {
  //   'eventData.breedingBatch': arrayRemove(oldAnimal)
  // })
  // const newAnimal = { ...oldAnimal, status: eventType }
  // const setNewAnimal = await eventsCRUD.updateItem(eventId, {
  //   'eventData.breedingBatch': arrayUnion(newAnimal)
  // })
  //return await Promise.all([removeOldAnimal, setNewAnimal])
}
export const updateAnimalStatusInBreedingBatch = async ({
  eventId,
  animalId,
  eventType
}: {
  eventId: string
  animalId?: string
  eventType: BaseFarmEvent['type']
}) => {
  try {
    const oldDbAnimal = await eventsCRUD
      .getItem(eventId)
      .then((res: any) =>
        res?.eventData?.breedingBatch?.find(
          (animal: any) => animal.id === animalId
        )
      )
    const removeOldAnimal = await eventsCRUD.updateItem(eventId, {
      'eventData.breedingBatch': arrayRemove(oldDbAnimal)
    })
    const newAnimal = { ...oldDbAnimal, status: eventType }
    const setNewAnimal = await eventsCRUD.updateItem(eventId, {
      'eventData.breedingBatch': arrayUnion(newAnimal)
    })

    return await Promise.all([removeOldAnimal, setNewAnimal])
  } catch (error) {
    console.error(error)
  }
}
/** ************** REMOVE ANIMAL FROM BREEDING BATCH ********** */

export const removeAnimalFromBreeding = async (
  eventId: BreedingEventType['id'],
  animalId: AnimalType['id']
) => {
  const oldDbAnimal = await eventsCRUD
    .getItem(eventId)
    .then((res: any) =>
      res?.eventData?.breedingBatch?.find(
        (animal: any) => animal.id === animalId
      )
    )
  return await eventsCRUD.updateItem(eventId, {
    'eventData.breedingBatch': arrayRemove(oldDbAnimal)
  })
}

export const getFarmEvents = async (farmId: string) => {
  return eventsCRUD.getItems([where('farm.id', '==', farmId)])
}

interface ListenFarmEventsOptions {
  limit: number
}
export const listenFarmEvents = async (
  farmId: string,
  cb: CallableFunction,
  options?: ListenFarmEventsOptions
) => {
  eventsCRUD.listenItems(
    [where('farm.id', '==', farmId), limit(options?.limit || 999)],
    cb
  )
}

export const addAnimalToBreedingBatchEvent = async (
  eventId: string,
  animal: AnimalType
) => {
  return await eventsCRUD.updateItem(eventId, {
    'eventData.breedingBatch': arrayUnion({ ...animal, status: 'PENDING' })
  })
}

export const addMaleToBreedingEvent = async (
  eventId: string,
  male: {
    earring: AnimalType['earring']
    id: AnimalType['id']
    startAt: number | Date | string
    finishAt: number | Date | string
  }
) => {
  const maleFormatted = eventsCRUD.deepFormatFirebaseDates(
    male,
    TARGET_FORMAT_DATE
  )
  return await eventsCRUD.updateItem(eventId, {
    'eventData.otherMales': arrayUnion({ ...maleFormatted })
  })
}

export const removeMaleFromBreedingEvent = async (
  eventId: string,
  maleIndex: number
) => {
  const breedingEvent = await eventsCRUD.getItem(eventId)
  // @ts-ignore
  const male = breedingEvent?.eventData?.otherMales[maleIndex]
  //console.log({ male })
  return await eventsCRUD.updateItem(eventId, {
    'eventData.otherMales': arrayRemove(male)
  })
}

export interface CreateEvent {
  type?: EventType['type']
  farm?: EventType['farm']
  eventData?: {
    date: DateType
    parents?: ParentsType
  }
}

export const createEvent_v2 = async (newItem: CreateEvent) =>
  await eventsCRUD.createItem(newItem)
