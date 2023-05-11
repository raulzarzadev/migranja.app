import { AnimalType } from 'types/base/AnimalType.model'
import determinateDeepRelationship, {
  Member
} from './determinateDeepRelationship'

/**
 *
 * @param a1 Animal 1 earring
 * @param a2 Animal 2 earring
 * @param animals List of animals where you will check
 * @returns
 */
const findAnimalRelationships = (
  a1: AnimalType['earring'],
  a2: AnimalType['earring'],
  animals: AnimalType[]
) => {
  const animalsFormatted: Member[] = animals.map((animal): Member => {
    const father = animal.parents?.father
    const mother = animal.parents?.mother
    return {
      father: father?.earring || '',
      mother: mother?.earring || '',
      name: animal.earring
    }
  })
  return determinateDeepRelationship(a1, a2, animalsFormatted)
}

export default findAnimalRelationships
