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
}
