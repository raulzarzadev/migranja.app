import { useSelector } from 'react-redux'
import { selectFarmState } from 'store/slices/farmSlice'

const useCurrentFarm = () => {
  const farm = useSelector(selectFarmState)
  return farm
}

export default useCurrentFarm
