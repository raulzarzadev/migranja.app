import { FirebaseCRUD } from '@firebase/firebase.CRUD.ts'
import { db, app } from '@firebase/main'
import { CreateBirthError, CreateBreedingError } from 'errorsHandlers/errors'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
const auth = getAuth(app)
const storage = getStorage(app)

const errorCRUD = new FirebaseCRUD('errors', db, storage, 'number')
export type Errors = 'CreateBreedingError' | 'CreateBirthError'

/**
 *
 * @param name Name of the handle error
 * @param error error instance from try catch or any other hadler error with
 * @param error.message details from optional error instance
 * @returns
 */

export const createError = async (name: Errors, error?: any) => {
  try {
    if (name === 'CreateBreedingError')
      throw new CreateBreedingError(error?.message || 'no message')
    if (name === 'CreateBirthError')
      throw new CreateBirthError(error?.message || 'no message')

    return await errorCRUD.createItem({
      name,
      message: error?.message || ''
    })
  } catch (error) {
    console.error({ error })
  }
}
