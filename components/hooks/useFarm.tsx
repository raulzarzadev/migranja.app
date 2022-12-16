import { getUserFarm } from '@firebase/Farm/main'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectFarmState, setFarmState } from 'store/slices/farmSlice'
import useAuth from './useAuth'
export interface UseFarmProps {
  onEditingChange?: boolean
}
const useFarm = (props?: UseFarmProps) => {
  const { user } = useAuth()
  const dispatch = useDispatch()
  const farm = useSelector(selectFarmState)
  useEffect(() => {
    getUserFarm().then((res) => {
      dispatch(setFarmState(res))
    })
  }, [user, dispatch, props?.onEditingChange])

  return { farm }
}

export default useFarm
