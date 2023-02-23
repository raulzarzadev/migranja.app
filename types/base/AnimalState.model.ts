export enum AnimalState {
  FREE = 'libre',
  BREEDING = 'en monta',
  FOR_BELLY = 'cordera', //* Para vientre
  FATTEN = 'engorda',
  LACTATING = 'lactante', //* lactante recien nacidas
  SUCKLE = 'lactando', //* amamantando lactando recien paridas
  FOR_SALE = 'en venta',
  SOLD = 'vendido',
  DEAD = 'muerto',
  LOST = 'perdido'
}
export enum AnimalStates {
  FREE,
  BREEDING,

  LACTATING, //* lactante recien nacidas
  SUCKLE, //* amamantando lactando recien paridas
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
  'FATTEN',
  'LACTATING',
  'SUCKLE',
  'FOR_BELLY',
  'FOR_SALE',
  'FREE'
]
/**
 * @remarks
 * LACTATING is a method for newborn calfs
 * SUCKLE is a method for ewes that have just given birth
 */
export type AnimalStateType = keyof typeof AnimalState
