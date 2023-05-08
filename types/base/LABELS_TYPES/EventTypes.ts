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
  | 'DONE'
  | 'CANCELLED'
  | 'WEANING_DONE'

export const labelsOfFarmEventTypes: Record<TypeOfFarmEvent, string> = {
  BREEDING: 'Monta',
  REMOVE: 'Eliminado',
  BIRTH: 'Parto',
  ABORT: 'Aborto',
  EMPTY: 'Vacio',
  DROP_OUT: 'Baja',
  DROP_IN: 'Alta',
  WEANING: 'Destete',
  PENDING: 'Pendiente',
  DONE: 'Completado',
  SELL: 'Venta',
  CANCELLED: 'Cancelado',
  WEANING_DONE: 'Destete Completo'
}

export type StatusOfFarmEvent = 'PENDING' | 'DONE' | 'CANCELLED' | 'PAST'
export type EventStatus = StatusOfFarmEvent

export type AnimalBreedingStatus = 'PENDING' | 'ABORT' | 'BIRTH' | 'EMPTY'
