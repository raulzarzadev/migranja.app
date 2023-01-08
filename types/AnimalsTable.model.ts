import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'

export interface AnimalTableType extends AnimalType {
  relationship?: {
    grade?: number
    relationship?: string
  }
}
