import { GenderOptions } from 'firebase/types.model.ts/AnimalType.model'

export const MaleOptions: GenderOptions = {
  gender: 'male',
  label: 'Macho',
  icon: 'male',
  parentLabel: 'Padre',
  value: 'male',
  en_parent: 'father'
}

export const FemaleOptions: GenderOptions = {
  gender: 'female',
  label: 'Hembra',
  icon: 'female',
  parentLabel: 'Madre',
  value: 'female',
  en_parent: 'mother'
}
export const GENDER_OPTIONS = {
  male: MaleOptions,
  female: FemaleOptions
}

export default GENDER_OPTIONS
