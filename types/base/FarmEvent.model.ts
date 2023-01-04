import { AnimalType } from './AnimalType.model'
import { TypeBase } from './TypeBase.model'

export interface BaseFarmEvent {
  type: 'BREEDING' | 'REMOVE' | 'BIRTH' | 'ABORT' | 'EMPTY'
  status?: string
  farm: {
    id: string
    name: string
  }
}

export interface FarmEvent extends TypeBase, BaseFarmEvent {}

export interface FarmEventDetails extends FarmEvent {}

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
  parents: ParentsType
  startAt: number | string
  finishAt: number | string
}

export interface SetGenericEventType<ContentType> extends FarmEvent {
  eventData: ContentType
}

export interface CreateGenericEventType<ContentType> extends BaseFarmEvent {
  eventData: ContentType
}

export interface EventData
  extends BreedingDetailsEvent,
    EmptyDetailsEvent,
    AbortDetailsEvent,
    BirthDetailsEvent {}

export interface EventDataStoreDetails
  extends CreateGenericEventType<Partial<EventData>> {}
