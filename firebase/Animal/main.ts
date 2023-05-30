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

// }
/**
 *
 * @param animalId  is the id of the animal
 * @param newState is the new state,
 * @param pastState   is the  state of the animal before it changed, can be undefined or null
 * @returns a promise with the update firebase response
 */
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

type DeleteFarmData = true | false
type UploadAnimalsArrayOptions = {
  deleteFarmData?: boolean
  deleteId?: boolean
  newFarmData?: DeleteFarmData extends true
    ? AnimalType['farm']
    : AnimalType['farm'] | undefined
}

/**
 *
 * @param animals an array of animals
 * @param ops configuration of de upload functions
 * @returns
 */
export const uploadAnimalsArray = async (
  animals: AnimalType[],
  ops?: UploadAnimalsArrayOptions
) => {
  let data: Partial<AnimalType>[] = animals

  //* Delete original farm data in each element
  if (ops?.deleteFarmData) {
    data = [...deleteProperty(data, 'farm')]
  }
  //* Delete id property in each element if is true you should indicate the new farm data
  if (ops?.deleteId) {
    data = [
      ...deleteProperty(data, 'id').map((animal) => ({
        ...animal,
        farm: ops.newFarmData
      }))
    ]
  }
  //* Add recovered animal property
  data = [
    ...data.map((animal) => ({
      ...animal,
      recoveredData: { recoveredAt: new Date() }
    }))
  ]

  return await AnimalsCRUD.uploadJSON({ json: data })
}

function deleteProperty<T extends Record<string, any>, K extends keyof T>(
  array: T[],
  property: K
): Omit<T, K>[] {
  return array.map(({ [property]: prop, ...rest }) => rest)
}

export const listenAppAnimals = (cb: CallableFunction) => {
  return AnimalsCRUD.listenItems([], cb)
}
