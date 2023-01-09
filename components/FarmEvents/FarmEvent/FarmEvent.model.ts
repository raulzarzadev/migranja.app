import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { Merge, TypeBase } from '@firebase/types.model.ts/TypeBase.model'
import { BaseFarmEvent } from 'types/base/FarmEvent.model'

export interface FarmEventType extends TypeBase {
  type: BaseFarmEvent['type']
  status?: string
  farm: {
    id: string
    name: string
  }
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

export interface BirthDetailsEvent {
  batch: string
  birthType: number
  calfs: Partial<AnimalType>[]
  date: number | string
  parents: ParentsType
  breedingId: string
}
export interface AbortDetailsEvent {
  date: number | string
  parents: ParentsType
  batch: string
  comments: string
  breedingId: string
}
export interface EmptyDetailsEvent {
  date: number | string
  parents: ParentsType
  batch: string
  comments: string
  breedingId: string
}
export interface BreedingDetailsEvent {
  breedingId: string
  breedingBatch: Partial<AnimalType>[]
  breedingMale: Partial<AnimalType> | null
  parents?: ParentsType
  startAt: number | string
  finishAt: number | string
  date: number | string
}

export interface GenericEventType<ContentType> extends FarmEventType {
  eventData: ContentType
}

export interface CreateGenericEventType<ContentType>
  extends Omit<FarmEventType, 'userId' | 'updatedAt' | 'id' | 'createdAt'> {
  eventData: ContentType
}

type EventData = Partial<
  Merge<
    Merge<BreedingDetailsEvent, AbortDetailsEvent>,
    Merge<BirthDetailsEvent, EmptyDetailsEvent>
  >
>

export interface GenericEventType<ContentType> extends FarmEventType {
  eventData: ContentType
}
export type FarmGenericsEventRedux = GenericEventType<EventData>[]
