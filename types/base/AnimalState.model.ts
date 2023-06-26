export const AnimalState = {
  FREE: 'Libre',
  PREGNANT: 'Gestante',
  BREEDING: 'En monta',
  FOR_BELLY: 'Cordera', //* Para vientre
  FATTEN: 'Engorda',
  LACTATING: 'Lactante', //* lactante recien nacidas
  SUCKLE: 'Lactando', //* amamantando lactando recien paridas
  FOR_SALE: 'En venta',
  //* Inactive animals states
  SOLD: 'Vendido',
  DEAD: 'Muerto',
  LOST: 'Perdido'
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
