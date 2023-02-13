import { BreedingEventType } from '@firebase/Events/event.model'
import { FarmType } from '@firebase/Farm/farm.model'
import { ImageType } from './ImageType.model'
import { DateType, TypeBase } from './TypeBase.model'
import { AnimalType as AnimalModelType } from 'types/base/AnimalType.model'
import { AnimalCurrentStatusType } from 'types/base/LABELS_TYPES/AnimalCurrentStatus'
import { AnimalType as AnimalMainType } from 'types/base/AnimalType.model'
export interface AnimalType extends AnimalMainType {
  // isStallion?: boolean
  // isDuplicated?: boolean
  // name: string
  // birthday: DateType
  // earring: string
  // images: ImageType[]
  // gender: 'male' | 'female'
  // breed: string
  // type: 'ovine' | 'bovine'
  // status?: AnimalCurrentStatusType
  // parents?: ParentsType
  // weight?: AnimalWeight
  // batch: string | null
  // birthType: number | string
  // joinedAt: DateType
  // farm?: {
  //   id?: FarmType['id']
  //   name?: FarmType['name']
  // }
  // batchData?: any
  // breeding?: any
  // statuses?: {
  //   isAlive?: boolean
  //   isInTheFarm?: boolean
  //   isPregnant?: boolean
  //   isSold?: boolean
  // }
  // currentStatus?: AnimalModelType['currentStatus']
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
  atBirth?: string | number | null
  atWeaning?: string | number | null // Destete
  at6Month?: string | number | null
  at12Month?: string | number | null
}

export interface ParentType
  extends Partial<
    Pick<
      AnimalType,
      'earring' | 'breed' | 'birthday' | 'gender' | 'name' | 'id'
    >
  > {
  inTheFarm: boolean
}
export interface ParentsType {
  father?: ParentType | null
  mother?: ParentType | null
}
