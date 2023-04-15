import { deleteAnimal } from '@firebase/Animal/main'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'

interface UseAnimal {
  animalId?: string
  earring?: string
}
const useAnimal = ({ animalId, earring }: UseAnimal = {}) => {
  const animal = useSelector(selectFarmAnimals).find(
    (animal) => animal.id === animalId || animal.earring === earring
  )
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
  return { handleDelete, animal }
}

export default useAnimal
