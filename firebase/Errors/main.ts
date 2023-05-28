import { FirebaseCRUD } from '@firebase/firebase.CRUD.ts'
import { db, app } from '@firebase/main'
import { CreateBirthError, CreateBreedingError } from 'errorsHandlers/errors'
import { getStorage } from 'firebase/storage'
import { TypeBase } from 'types/base/TypeBase.model'
const storage = getStorage(app)

const errorCRUD = new FirebaseCRUD('errors', db, storage, 'number')
export type Errors = 'CreateBreedingError' | 'CreateBirthError'
export interface ErrorType extends TypeBase {
  message: string
  name: Errors
}
/**
 *
 * @param name Name of the handle error
 * @param error error instance from try catch or any other hadler error with
 * @param error.message details from optional error instance
 * @returns
 */

export const createError = async (name: Errors, error?: any) => {
  try {
    await errorCRUD.createItem({
      name,
      message: error?.message || ''
    })
    if (name === 'CreateBreedingError')
      throw new CreateBreedingError(error?.message || 'no message')
    if (name === 'CreateBirthError')
      throw new CreateBirthError(error?.message || 'no message')
  } catch (error) {
    console.error({ error })
  }
}

export const listenErrors = (cb: (errors: ErrorType[]) => void) => {
  errorCRUD.listenItems([], cb)
}
