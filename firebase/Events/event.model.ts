import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { DateType, TypeBase } from '@firebase/types.model.ts/TypeBase.model'
import { FarmType } from '@firebase/Farm/farm.model'

export interface Event extends TypeBase {
  type: 'BREEDING' | 'REMOVE'
  date: DateType
  startAt: DateType
  finishAt: DateType
  breedingBatch: Partial<AnimalType>[]
  breedingMale: Partial<AnimalType>
  farm: Pick<FarmType, 'name' | 'id'>
}

export interface CreateEventDTO
  extends Pick<
    Event,
    'breedingBatch' | 'type' | 'startAt' | 'finishAt' | 'breedingMale' | 'farm'
  > {}

export interface EventDTO extends Partial<Event> {}
