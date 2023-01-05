import { BreedingDatesType } from 'components/BreedingsList/breeding.helpers'
import { AnimalType, ParentsType } from './AnimalType.model'
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
export interface BirthDetailsEvent extends BreedingEventDefaultInfo {
  birthType: number
  calfs: Partial<AnimalType>[]
}
export interface AbortDetailsEvent extends BreedingEventDefaultInfo {
  comments: string
}
export interface EmptyDetailsEvent extends BreedingEventDefaultInfo {
  comments: string
}
export interface BreedingDetailsEvent extends BreedingEventDefaultInfo {
  breedingDates?: BreedingDatesType
}

export interface BreedingEventDefaultInfo {
  id: string
  date?: number | string
  breedingId: string
  batchId: string
  breedingBatch: Partial<AnimalType>[]
  breedingMale: ParentType | null
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

export interface FarmBreedingEvent
  extends SetGenericEventType<BreedingDetailsEvent> {}

export interface EventData
  extends BreedingEventDefaultInfo,
    BreedingDetailsEvent,
    EmptyDetailsEvent,
    AbortDetailsEvent,
    BirthDetailsEvent {
  breedingDates?: BreedingDatesType
}

export interface EventDataStoreDetails extends SetGenericEventType<EventData> {}

export interface BreedingEventCardDetails
  extends SetGenericEventType<EventData> {}

export interface DTO_CreateBreedingEventType
  extends CreateGenericEventType<BreedingDetailsEvent> {}
