export enum AnimalState {
  FREE = 'libre',
  BREEDING = 'monta',
  SUCKLE = 'lactando',
  FATTEN = 'engorda',
  FOR_BELLY = 'vientre',
  FOR_SALE = 'venta',
  SOLD = 'vendido',
  DEAD = 'muerto',
  LOST = 'perdido'
}
export enum AnimalStates {
  FREE,
  BREEDING,
  SUCKLE,
  FATTEN,
  FOR_BELLY,
  FOR_SALE,
  SOLD,
  DEAD,
  LOST
}
export const inactiveAnimalsStates: AnimalStateType[] = ['SOLD', 'LOST', 'DEAD']
export const activeAnimalsStates: AnimalStateType[] = [
  'BREEDING',
  'SUCKLE',
  'FATTEN',
  'FOR_BELLY',
  'FOR_SALE',
  'FREE'
]
export type AnimalStateType = keyof typeof AnimalState
