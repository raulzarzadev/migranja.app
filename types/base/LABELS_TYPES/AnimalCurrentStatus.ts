import { AnimalType } from '../AnimalType.model'

export const animalCurrentStatusLabels: Record<
  NonNullable<AnimalType['currentStatus']>,
  string
> = {
  //! Deprecated file, DO NOT USE, see AnimalState file
  PENDING: 'Pendiente',
  ACTIVE: 'Activa',
  PREGNANT: 'Cargada',
  DEAD: 'Muerta',
  STOLEN: 'Robada',
  SICK: 'Enferma',
  LOST: 'Perdida',
  SOLD: 'Vendida',
  ABORT: 'Aborto',
  BIRTH: 'Parto',
  EMPTY: 'Vacia',
  DONE: 'Hecho',
  MISSED: 'No Encontrada'
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
  | 'MISSED'
