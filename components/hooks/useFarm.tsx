import { listenFarmAnimals } from '@firebase/Animal/main'
import { getFarmEvents, listenFarmEvents } from '@firebase/Events/main'
import { FarmType } from '@firebase/Farm/farm.model'
import { listenFarm, listenUserFarms } from '@firebase/Farm/main'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectFarmAnimals,
  selectFarmEvents,
  selectFarmState,
  selectUserFarm,
  setFarmAnimals,
  setFarmEvents,
  setFarmState,
  setUserFarm
} from 'store/slices/farmSlice'
import useAuth from './useAuth'

export interface UseFarm {
  getFarmById?: FarmType['id']
}

const useFarm = (props?: UseFarm) => {
  const dispatch = useDispatch()
  const { user } = useAuth()

  const currentFarm = useSelector(selectFarmState)
  const farmAnimals = useSelector(selectFarmAnimals)
  const farmEvents = useSelector(selectFarmEvents)
  const userFarm = useSelector(selectUserFarm)

  const [farmEarrings, setFarmEarrings] = useState<string[]>([])

  const {
    query: { farmId }
  } = useRouter()

  useEffect(() => {
    if (user && userFarm === undefined) {
      listenUserFarms((res: FarmType[] | null) => {
        dispatch(setUserFarm(res?.[0] || null))
      })
    }
  }, [dispatch, user, userFarm])

  useEffect(() => {
    if (user && farmId) {
      listenFarm(farmId as string, (res: any) => {
        dispatch(setFarmState(res))
      })
      listenFarmAnimals(farmId as string, (res: any[]) => {
        const earringsList = res?.map((animal) => `${animal.earring}`)
        setFarmEarrings(earringsList)
        dispatch(setFarmAnimals(res))
      })
      listenFarmEvents(farmId as string, (res: any[]) => {
        dispatch(setFarmEvents(res))
      })
    }
  }, [dispatch, farmId, user])

  return {
    currentFarm,
    farmAnimals,
    farmEarrings,
    userFarm,
    farmEvents
  }
}

export default useFarm
