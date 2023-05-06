import { deleteAnimal } from '@firebase/Animal/main'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import useFarmAnimals from './useFarmAnimals'
import { AnimalType } from 'types/base/AnimalType.model'

interface UseAnimal {
  animalId?: string
  earring?: string
}
const useAnimal = ({ animalId, earring }: UseAnimal = {}) => {
  const animals = useFarmAnimals()
  const animal = animals.find(
    (animal) => animal.id === animalId || animal.earring === earring
  )

  const findAnimal = ({
    animalId,
    animalEarring
  }: {
    animalId?: AnimalType['id']
    animalEarring?: AnimalType['earring']
  }) =>
    animals.find(
      ({ id, earring }) =>
        //* if animalId exist and is equal to animal id
        (!!animalId && animalId === id) ||
        //* if earringId exist and is equal to animal earring
        (!!animalEarring && animalEarring === earring)
    )

  const findParents = ({
    animalId,
    animalEarring
  }: {
    animalId?: AnimalType['id']
    animalEarring?: AnimalType['earring']
  }) => findAnimal({ animalEarring, animalId })?.parents

  const handleDelete = async (id?: string): Promise<boolean> => {
    try {
      const res = await deleteAnimal(id || (animalId as string))
      console.log(res)
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
  return { handleDelete, animal, findAnimal, findParents }
}

export default useAnimal
