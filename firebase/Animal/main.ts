import { FarmType } from '@firebase/Farm/farm.model'
import { where } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { AnimalType } from 'types/base/AnimalType.model'
import { FirebaseCRUD } from '../firebase.CRUD.ts'
import { app, db } from '../main'
import { CreateAnimalDTO } from './animal.model'

const storage = getStorage(app)

const AnimalsCRUD = new FirebaseCRUD('animals', db, storage)

export const createAnimal = async (newItem: CreateAnimalDTO) =>
  await AnimalsCRUD.createItem(newItem)

export const updateAnimal = async (itemId: string, newItem: CreateAnimalDTO) =>
  await AnimalsCRUD.updateItem(itemId, newItem)

export const deleteAnimal = async (itemId: string) =>
  await AnimalsCRUD.deleteItem(itemId)

export const getAnimal = async (itemId: string) =>
  await AnimalsCRUD.getItem(itemId)

export const listenAnimal = async (itemId: string, cb: CallableFunction) =>
  await AnimalsCRUD.listenItem(itemId, cb)

export const getOvines = async () =>
  await AnimalsCRUD.getUserItems([where('type', '==', 'ovine')])

export const listenOvines = (cb: CallableFunction) => {
  return AnimalsCRUD.listenItems([where('type', '==', 'ovine')], cb)
}

export const listenFarmOvines = (
  farmId: FarmType['id'],
  cb: CallableFunction
) => AnimalsCRUD.listenItems([where('farm.id', '==', farmId)], cb)

export const listenFarmAnimals = (
  farmId: FarmType['id'],
  cb: CallableFunction
) => AnimalsCRUD.listenItems([where('farm.id', '==', farmId)], cb)

export const updateAnimalState = async (
  animalId: AnimalType['earring'],
  newState: AnimalType['state'],
  pastState?: AnimalType['state']
) => {
  return await updateAnimal(animalId, {
    pastState: pastState || null,
    state: newState
  })
}

export const getMaleOvines = async () =>
  await AnimalsCRUD.getUserItems([
    where('type', '==', 'ovine'),
    where('gender', '==', 'male')
  ])

export const getFemaleOvines = async () =>
  await AnimalsCRUD.getUserItems([
    where('type', '==', 'ovine'),
    where('gender', '==', 'female')
  ])

export const getFarmFemaleOvines = async (farmId: string) =>
  await AnimalsCRUD.getUserItems([
    where('farm.id', '==', farmId),
    where('type', '==', 'ovine'),
    where('gender', '==', 'female')
  ])

export const getFarmMaleOvines = async (farmId: string) =>
  await AnimalsCRUD.getUserItems([
    where('farm.id', '==', farmId),
    where('type', '==', 'ovine'),
    where('gender', '==', 'male')
  ])
