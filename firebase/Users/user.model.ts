import { FarmType } from '@firebase/Farm/farm.model'
import { ImageType } from '../types.model.ts/ImageType.model'
import { TypeBase } from '../types.model.ts/TypeBase.model'

export interface CreateUserDTO extends Partial<UserType> {}
export interface UserType extends TypeBase {
  isDev?: boolean
  photoURL: any
  image: string
  name?: string | null
  email: string
  isCoach?: boolean
  displayName?: string
  alias?: string | null
  images: ImageType[]
  emailVerified: boolean
  farmId?: FarmType['id']
}
