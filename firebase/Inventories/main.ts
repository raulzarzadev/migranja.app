import { where } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { Inventory } from 'types/base/Inventory.model'
import { FirebaseCRUD } from '../firebase.CRUD.ts'
import { app, db } from '../main'

const storage = getStorage(app)
const TARGET_FORMAT_DATE = 'number'

export const inventoriesCRUD = new FirebaseCRUD(
  'inventories',
  db,
  storage,
  TARGET_FORMAT_DATE
)

/** ************** CREATE ********** */
export const createInventory = async (newItem: Inventory) =>
  await inventoriesCRUD.createItem(newItem)

/** ************** UPDATE ********** */
export const updateInventory = async (itemId: string, newItem: Inventory) =>
  await inventoriesCRUD.updateItem(itemId, newItem)

/** ************** DELETE ********** */
export const deleteInventory = async (itemId: string) =>
  await inventoriesCRUD.deleteItem(itemId)

/** ************** GET ********** */
export const getInventory = async (itemId: string) =>
  await inventoriesCRUD.getItem(itemId)

/** ************** LISTEN ONE ********** */
export const listenInventory = async (itemId: string, cb: CallableFunction) =>
  await inventoriesCRUD.listenItem(itemId, cb)
/** ************** LISTEN FARM INVENTORIES ********** */
export const listenFarmInventories = async (
  farmId: string,
  cb: CallableFunction
) => await inventoriesCRUD.listenItems([where('farm.id', '==', farmId)], cb)
