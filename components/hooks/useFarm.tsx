import { listenFarmOvines } from '@firebase/Animal/main'
import { FarmType } from '@firebase/Farm/farm.model'
import { listenFarm, listenUserFarms } from '@firebase/Farm/main'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectFarmOvines,
  selectFarmState,
  setFarmOvines,
  setFarmState
} from 'store/slices/farmSlice'
import useAuth from './useAuth'

export interface UseFarm {
  getFarmById?: FarmType['id']
}

const useFarm = (props?: UseFarm) => {
  const getFarmById = props?.getFarmById

  const dispatch = useDispatch()
  const { user } = useAuth()
  const currentFarm = useSelector(selectFarmState)
  const farmOvines = useSelector(selectFarmOvines)
  const [userFarm, setUserFarm] = useState<FarmType | null>(null)
  const [farmData, setFarmData] = useState<FarmType | null>(null)
  useEffect(() => {
    if (getFarmById) listenFarm(getFarmById, (res: any) => setFarmData(res))
  }, [getFarmById])

  const {
    query: { farmId }
  } = useRouter()

  useEffect(() => {
    user &&
      listenUserFarms((res: FarmType[] | null) => setUserFarm(res?.[0] || null))
  }, [user])

  useEffect(() => {
    if (farmId) {
      listenFarm(farmId as string, (res: FarmType) => {
        dispatch(setFarmState(res))
      })
      listenFarmOvines(farmId as string, (res: FarmType) => {
        dispatch(setFarmOvines(res))
      })
    }
  }, [dispatch, farmId])

  const currentFarmEarrings = [...farmOvines].map(
    (animal) => `${animal.earring}`
  )

  return {
    currentFarm: { ...currentFarm, animals: [...farmOvines] } as FarmType,
    currentFarmEarrings,
    userFarm,
    farmData
  }
}

export default useFarm
