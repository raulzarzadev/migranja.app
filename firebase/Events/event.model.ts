import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { DateType, TypeBase } from '@firebase/types.model.ts/TypeBase.model'
import { FarmType } from '@firebase/Farm/farm.model'

export interface EventType extends TypeBase {
  type: 'BREEDING' | 'REMOVE' | 'BIRTH'
  date: DateType
  startAt: DateType
  finishAt: DateType
  breedingBatch: Partial<AnimalType>[]
  breedingMale: Partial<AnimalType>
  farm: Pick<FarmType, 'name' | 'id'>
  batch: string
}

export interface BreedingEventType extends EventType {
  type: 'BREEDING'
  possibleBirth?: {
    startAt?: DateType
    finishAt?: DateType
  }
  breedingBirths?: Partial<AnimalType>[]
  breedingAborts?: Partial<AnimalType>[]
  breedingEmpty?: Partial<AnimalType>[]
}
export interface CreateBirthEventType extends Partial<EventType> {
  type: 'BIRTH'
  parents: AnimalType['parents']
}

export interface CreateEventDTO
  extends Pick<
    EventType,
    | 'breedingBatch'
    | 'type'
    | 'startAt'
    | 'finishAt'
    | 'breedingMale'
    | 'farm'
    | 'batch'
  > {}

export interface EventDTO extends Partial<Event> {}
