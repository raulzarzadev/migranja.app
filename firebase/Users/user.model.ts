import { TypeBase } from '../TypeBase.model'

export interface CreateUserDTO extends Partial<UserType> {}
export interface UserType extends TypeBase {
  photoURL: any
  image: any
  name?: string | null
  email: string
  isCoach?: boolean
  displayName?: string
  alias?: string | null
  images: Image[]
  emailVerified: boolean
}

interface Image {
  url: string
  metadata?: any
}
