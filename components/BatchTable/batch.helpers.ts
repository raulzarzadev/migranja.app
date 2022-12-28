import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'

export const findDuplicatesAnimals = (
  batchAnimals: Partial<AnimalType>[],
  dbAnimals: Partial<AnimalType>[]
) => {
  return batchAnimals.map((animal) => {
    const animalMatch = [...dbAnimals].some(
      (ovine) => ovine.earring === animal?.earring
    )
    if (animalMatch) {
      return { ...animal, isDuplicated: true }
    } else {
      return { ...animal, isDuplicated: false }
    }
  })
}

export const handleSetDuplicatedAnimal = (
  option: 'FORWARD' | 'DELETE' | 'REPLACE',
  animal: any,
  animals: AnimalType[]
): AnimalType[] => {
  if (option === 'DELETE') {
    return [...animals.filter(({ earring }) => earring !== animal.earring)]
  }

  if (option === 'REPLACE') {
    const animalAux = [...animals]
    const animalIndex = animalAux.findIndex(
      ({ earring }) => earring === animal.earring
    )
    const newAnimal = {
      ...animal,
      earring: animal.newEarring
    }
    delete newAnimal.newEarring
    animalAux.splice(animalIndex, 1, newAnimal)
    console.log({ animalAux })
    return [...animalAux]
  }

  if (option === 'FORWARD') {
    const animalAux = [...animals]
    const animalIndex = animalAux.findIndex(
      ({ earring }) => earring === animal.earring
    )
    animalAux.splice(animalIndex, 1)
    const lastEarring = animalAux[animalAux.length - 1].earring || ''
    const earringNum = parseInt(lastEarring?.split('-')[0])
    const earringSuffix = lastEarring?.split('-')[1]
    return [
      ...animalAux,
      {
        ...animal,
        earring: `${earringNum + 1}${earringSuffix ? '-' + earringSuffix : ''}`
      }
    ]
  }

  return [...animals]
}

export const getDuplicatedEarrings = (animals: Partial<AnimalType>[]) => {
  return [...animals].filter(
    (animal, i) =>
      [...animals].findIndex(({ earring }) => earring === animal.earring) !== i
  )
}
