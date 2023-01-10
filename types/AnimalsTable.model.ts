import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'

export interface AnimalTableType extends AnimalType {
  relationship?: {
    grade?: number
    relationship?: string
  }
}

// ✅ Remove nullable types from the type's keys
export type WithoutNullableKeys<Type> = {
  [Key in keyof Type]-?: WithoutNullableKeys<NonNullable<Type[Key]>>
}
