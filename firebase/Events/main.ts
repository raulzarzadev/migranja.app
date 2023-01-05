import { getAuth } from 'firebase/auth'
import { arrayRemove, arrayUnion, where } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { FirebaseCRUD } from '../firebase.CRUD.ts'
import { app, db } from '../main'
import { EventDTO, CreateEventDTO, BreedingEventType } from './event.model'

import { AnimalType } from 'firebase/types.model.ts/AnimalType.model'
import { CreateGenericEventType } from 'components/FarmEvents/FarmEvent/FarmEvent.model'
import {
  BaseFarmEvent,
  BirthDetailsEvent,
  EventData
} from 'types/base/FarmEvent.model'
const storage = getStorage(app)

const eventsCRUD = new FirebaseCRUD('events', db, storage)

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

/** **

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
  eventType
}: {
  eventId: string
  animalId: string
  eventType: BaseFarmEvent['type']
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
  const newAnimal = { ...oldAnimal, status: eventType }
  const setNewAnimal = await eventsCRUD.updateItem(eventId, {
    'eventData.breedingBatch': arrayUnion(newAnimal)
  })
  return await Promise.all([oldAnimal, removeOldAnimal, setNewAnimal])
}
export const updateBreedingEventBatch = async ({
  eventId,
  animalId,
  eventType,
  eventData
}: {
  eventId: string
  animalId: string
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
/** ************** REMOVE ANIMAL FROM BREEDING BATCH ********** */

export const removeAnimalFromBreeding = async (
  breedingId: BreedingEventType['id'],
  animalId: AnimalType['id']
) => {
  const breeding: Partial<BreedingEventType> | null = await eventsCRUD.getItem(
    breedingId
  )
  const breedingAnimal = [...(breeding?.breedingBatch || [])].find(
    (animal) => animal?.id === animalId
  )
  await eventsCRUD.updateItem(breedingId, {
    breedingBatch: arrayRemove(breedingAnimal)
  })
}

export const getFarmEvents = async (farmId: string) => {
  return eventsCRUD.getItems([where('farm.id', '==', farmId)])
}
export const listenFarmEvents = async (
  farmId: string,
  cb: CallableFunction
) => {
  eventsCRUD.listenItems([where('farm.id', '==', farmId)], cb)
}
