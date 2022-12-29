import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { DateType, TypeBase } from '@firebase/types.model.ts/TypeBase.model'
import { UserType } from '@firebase/Users/user.model'

export interface Event extends TypeBase {
  type: 'BREEDING' | 'REMOVE'
  date: DateType
  startAt: DateType
  finishAt: DateType
  breedingBatch: Partial<AnimalType>[]
  breedingMale: String
}
