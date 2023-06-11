export const AnimalState = {
  FREE: 'libre',
  BREEDING: 'en monta',
  FOR_BELLY: 'cordera', //* Para vientre
  FATTEN: 'engorda',
  LACTATING: 'lactante', //* lactante recien nacidas
  SUCKLE: 'lactando', //* amamantando lactando recien paridas
  FOR_SALE: 'en venta',
  PREGNANT: 'Preñada',
  //* Inactive animals states
  SOLD: 'vendido',
  DEAD: 'muerto',
  LOST: 'perdido'
}

export const inactiveAnimalsStates: AnimalStateType[] = ['SOLD', 'LOST', 'DEAD']
export type AnimalStateType = keyof typeof AnimalState

export const AnimalStates: AnimalStateType[] = Object.keys(
  AnimalState
) as AnimalStateType[]

export const activeAnimalsStates: AnimalStateType[] = [
  ...AnimalStates.filter((state) => !inactiveAnimalsStates.includes(state))
]
/**
 * @remarks
 * LACTATING is a method for newborn calfs
 * SUCKLE is a method for ewes that have just given birth
 */
