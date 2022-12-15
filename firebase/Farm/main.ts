import { UserType } from '@firebase/Users/user.model'
import { getAuth } from 'firebase/auth'
import { where } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { FirebaseCRUD } from '../firebase.CRUD.ts'
import { app, db } from '../main'
import { CreateFarmDTO } from './Farms.model'

const storage = getStorage(app)

const farmsCRUD = new FirebaseCRUD('farms', db, storage)

/** ************** CREATE ********** */
export const createFarm = async (newItem: CreateFarmDTO) =>
  await farmsCRUD.createItem(newItem)

/** ************** UPDATE ********** */
export const updateFarm = async (itemId: string, newItem: CreateFarmDTO) =>
  await farmsCRUD.updateItem(itemId, newItem)

/** ************** DELETE ********** */
export const deleteFarm = async (itemId: string) =>
  await farmsCRUD.deleteItem(itemId)

/** ************** GET ********** */

export const getFarm = async (itemId: string) => await farmsCRUD.getItem(itemId)

/** ************** LISTEN ONE ********** */

export const listenFarm = async (itemId: string, cb: CallableFunction) =>
  await farmsCRUD.listenItem(itemId, cb)

/** ************** LISTEN CURRENT USER ********** */
const currentUser = getAuth().currentUser
export const listenUserFarms = async (cb: CallableFunction) => {
  return await farmsCRUD.listenItems(
    [where('directedTo', '==', currentUser)],
    cb
  )
}
