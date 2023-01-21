export type TypeOfFarmEvent =
  | 'BREEDING'
  | 'REMOVE'
  | 'BIRTH'
  | 'ABORT'
  | 'EMPTY'
  | 'DROP_OUT'
  | 'DROP_IN'
  | 'WEANING'
  | 'PENDING'
  | 'SELL'

export const labelsOfFarmEventTypes: Record<TypeOfFarmEvent, string> = {
  BREEDING: 'Monta',
  REMOVE: 'Eliminado',
  BIRTH: 'Parto',
  ABORT: 'Aborto',
  EMPTY: 'Vacio',
  DROP_OUT: 'Alta',
  DROP_IN: 'Baja',
  WEANING: 'Destete',
  PENDING: 'Pendiente',
  SELL: 'Venta'
}

export type StatusOfFarmEvent = 'PENDING' | 'DONE' | 'CANCELLED'
export type EventStatus = StatusOfFarmEvent

export type AnimalBreedingStatus = 'PENDING' | 'ABORT' | 'BIRTH' | 'EMPTY'
