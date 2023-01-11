import { FarmType } from '@firebase/Farm/farm.model'
import { BreedingDetailsEvent, SetGenericEventType } from './FarmEvent.model'
import { ImageType } from './ImageType.model'
import { AnimalCurrentStatusType } from './LABELS_TYPES/AnimalCurrentStatus'
import { DateType, Merge, TypeBase } from './TypeBase.model'

export interface AnimalType extends TypeBase {
  isDuplicated?: boolean
  name: string
  birthday: DateType
  earring: string
  images: ImageType[]
  gender: 'male' | 'female'
  breed: string
  type: 'ovine' | 'bovine'
  status?: AnimalCurrentStatusType
  parents?: ParentsType
  weight?: AnimalWeight
  batch: string | null
  birthType: number | string
  joinedAt: DateType
  farm?: {
    id?: FarmType['id']
    name?: FarmType['name']
  }
  batchData?: any
  breeding?: any
  statuses?: {
    isAlive?: boolean
    isInTheFarm?: boolean
    isPregnant?: boolean
    isSold?: boolean
  }
  currentStatus?: AnimalCurrentStatusType
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

export interface AnimalFormattedWhitGenericEvenData
  extends Merge<
    Partial<AnimalType>,
    SetGenericEventType<BreedingDetailsEvent>
  > {}
