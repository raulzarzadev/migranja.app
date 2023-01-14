import { AnimalType } from '../AnimalType.model'

export const animalCurrentStatusLabels: Record<
  NonNullable<AnimalType['currentStatus']>,
  string
> = {
  PENDING: 'Pendiente',
  ACTIVE: 'Activa',
  PREGNANT: 'Cargada',
  DEAD: 'Muerta',
  STOLEN: 'Robada',
  SICK: 'Enferma',
  LOST: 'Perdida',
  SOLD: 'Vendia',
  ABORT: 'Aborto',
  BIRTH: 'Parto',
  EMPTY: 'Vacia',
  DONE: 'Hecho'
}

export type AnimalCurrentStatusType =
  | 'PENDING'
  | 'ACTIVE'
  | 'DEAD'
  | 'PREGNANT'
  | 'LOST'
  | 'SOLD'
  | 'SICK'
  | 'STOLEN'
  | 'ABORT'
  | 'BIRTH'
  | 'EMPTY'
  | 'DONE'
