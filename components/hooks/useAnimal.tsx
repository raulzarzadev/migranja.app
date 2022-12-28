import { deleteAnimal } from '@firebase/Animal/main'

const useAnimal = () => {
  const handleDelete = async (id: string): Promise<boolean> => {
    try {
      const res = await deleteAnimal(id as string)
      console.log(res)
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
  return { handleDelete }
}

export default useAnimal
