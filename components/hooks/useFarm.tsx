import { FarmType } from '@firebase/Farm/farm.model'
import { getUserFarm, listenUserFarm } from '@firebase/Farm/main'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectFarmState, setFarmState } from 'store/slices/farmSlice'
import useAuth from './useAuth'
export interface UseFarmProps {
  onEditingChange?: boolean
}
const useFarm = (props?: UseFarmProps) => {
  const dispatch = useDispatch()

  const farm = useSelector(selectFarmState)

  useEffect(() => {
    listenUserFarm((res: FarmType[]) => {
      dispatch(setFarmState(res[0]))
    })
  }, [dispatch])

  // useEffect(() => {
  //   getUserFarm().then((res) => {
  //     dispatch(setFarmState(res))
  //   })
  // }, [user, dispatch, props?.onEditingChange])

  return { farm, userFarm: farm }
}

export default useFarm
