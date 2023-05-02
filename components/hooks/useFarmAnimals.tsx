import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'

const useFarmAnimals = () => {
  const animals = useSelector(selectFarmAnimals)
  return animals
}

export default useFarmAnimals
