import { ImageType } from './ImageType.model'
import { TypeBase } from './TypeBase.model'

export interface AnimalType extends TypeBase {
  name: string
  birthday: string
  earring: string
  images: ImageType[]
  gender: 'male' | 'female'
  breed: string
  type: 'ovine' | 'bovine'
  status: string
  parents?: ParentsType
}
export interface ParentType
  extends Pick<AnimalType, 'earring' | 'breed' | 'birthday' | 'gender'> {
  inTheFarm: boolean
}
export interface ParentsType {
  father?: ParentType | null
  mother?: ParentType | null
}
