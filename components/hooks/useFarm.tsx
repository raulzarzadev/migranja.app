import { FarmType } from '@firebase/Farm/farm.model'
import { getFarm, listenFarm, listenUserFarms } from '@firebase/Farm/main'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectFarmState, setFarmState } from 'store/slices/farmSlice'
import useAuth from './useAuth'

export interface UseFarm {
  getFarmById?: FarmType['id']
}

const useFarm = (props?: UseFarm) => {
  const getFarmById = props?.getFarmById

  const dispatch = useDispatch()
  const { user } = useAuth()
  const currentFarm = useSelector(selectFarmState)
  const [userFarm, setUserFarm] = useState<FarmType | null>(null)
  const [farmData, setFarmData] = useState<FarmType | any>(null)

  const {
    query: { farmId }
  } = useRouter()

  useEffect(() => {
    if (getFarmById) listenFarm(getFarmById, (res) => setFarmData(res))
  }, [getFarmById])

  useEffect(() => {
    user &&
      listenUserFarms((res: FarmType[] | null) => setUserFarm(res?.[0] || null))
  }, [user])

  useEffect(() => {
    farmId &&
      listenFarm(farmId as string, (res: FarmType) => {
        dispatch(setFarmState(res))
      })
  }, [dispatch, farmId, user])

  return { currentFarm, userFarm, farmData }
}

export default useFarm
