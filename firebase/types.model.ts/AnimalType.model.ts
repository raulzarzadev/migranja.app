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
  weight?: AnimalWeight
  lote: string
  birthType: number
}

export interface GenderOptions {
  id?: 'male' | 'female'
  icon?: GenderOptions['id']
  value?: GenderOptions['id']
  gender?: AnimalType['gender']
  label?: 'Macho' | 'Hembra'
  parentLabel?: 'Padre' | 'Madre'
  en_parent: 'mother' | 'father'
}

export interface AnimalWeight {
  atBirth?: string | number
  atWeaning?: string | number // Destete
  at6Month: string | number
  at12Month: string | number
}

export interface ParentType
  extends Pick<AnimalType, 'earring' | 'breed' | 'birthday' | 'gender'> {
  inTheFarm: boolean
}
export interface ParentsType {
  father?: ParentType | null
  mother?: ParentType | null
}
