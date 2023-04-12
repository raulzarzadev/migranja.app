import { UserType } from '@firebase/Users/user.model'
import { getAuth } from 'firebase/auth'
import { where } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { FirebaseCRUD } from '../firebase.CRUD.ts'
import { app, db } from '../main'
import { CreateFarmDTO } from './farm.model'

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

export const getUserFarm = async (userId?: UserType['id']) => {
  const currentUser = userId || getAuth().currentUser?.uid
  return await farmsCRUD
    .getItems([where('userId', '==', currentUser)])
    .then((items) => items[0] || null)
}
export const getUserFarms = async (userId?: UserType['id']) => {
  const currentUser = userId || getAuth().currentUser?.uid
  return await farmsCRUD
    .getItems([where('userId', '==', currentUser)])
    .then((items) => items || [])
}

/** ************** LISTEN ONE ********** */

export const listenFarm = async (itemId: string, cb: CallableFunction) =>
  await farmsCRUD.listenItem(itemId, cb)

/** ************** LISTEN CURRENT USER ********** */

export const listenUserFarms = (cb: CallableFunction) => {
  const currentUser = getAuth().currentUser?.uid
  farmsCRUD.listenItems([where('userId', '==', currentUser)], cb)
}

export const listenUserInvitationsToFarms = (
  userId: string,
  cb: CallableFunction
) => {
  farmsCRUD.listenItems(
    [
      where(`team.${userId}.id`, '==', userId), // verify if team user was created
      where(`team.${userId}.invitation.sent`, '==', true) // verify if invitation  was made
    ],
    cb
  )
}

export const getInvitationsFarm = async (userId: string) => {
  return farmsCRUD.getItems([
    where(`team.${userId}.id`, '==', userId), // verify if team user was created
    where(`team.${userId}.invitation.sent`, '==', true) // verify if invitation  was made
  ])
}
