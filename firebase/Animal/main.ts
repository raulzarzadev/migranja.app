import { where } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
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
