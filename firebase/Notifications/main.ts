import { UserType } from '@firebase/Users/user.model'
import { getAuth } from 'firebase/auth'
import { where } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { FirebaseCRUD } from '../firebase.CRUD.ts'
import { app, db } from '../main'
import { CreateNotificationDTO } from './notifications.model'

const storage = getStorage(app)

const notificationsCRUD = new FirebaseCRUD('notifications', db, storage)

/** ************** CREATE ********** */
export const createNotification = async (newItem: CreateNotificationDTO) =>
  await notificationsCRUD.createItem(newItem)

/** ************** UPDATE ********** */
export const updateNotification = async (
  itemId: string,
  newItem: CreateNotificationDTO
) => await notificationsCRUD.updateItem(itemId, newItem)

/** ************** DELETE ********** */
export const deleteNotification = async (itemId: string) =>
  await notificationsCRUD.deleteItem(itemId)

/** ************** GET ********** */

export const getNotification = async (itemId: string) =>
  await notificationsCRUD.getItem(itemId)

/** ************** LISTEN ONE ********** */

export const listenNotification = async (
  itemId: string,
  cb: CallableFunction
) => await notificationsCRUD.listenItem(itemId, cb)

/** ************** LISTEN CURRENT USER ********** */
const currentUser = getAuth().currentUser
export const listenUserNotifications = async (cb: CallableFunction) => {
  return await notificationsCRUD.listenItems(
    [where('directedTo', '==', currentUser)],
    cb
  )
}
