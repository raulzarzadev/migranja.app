import { listenFarmAnimals } from '@firebase/Animal/main'
import { getFarmEvents, listenFarmEvents } from '@firebase/Events/main'
import { FarmType } from '@firebase/Farm/farm.model'
import { listenFarm, listenUserFarms } from '@firebase/Farm/main'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAuthState } from 'store/slices/authSlice'
import {
  setFarmAnimals,
  setFarmEvents,
  setFarmState,
  setUserFarm
} from 'store/slices/farmSlice'

const useFarmFarmState = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectAuthState)

  const {
    query: { farmId }
  } = useRouter()

  useEffect(() => {
    if (user && farmId) {
      listenFarm(farmId as string, (res: any) => {
        dispatch(setFarmState(res))
      })
      listenFarmAnimals(farmId as string, (res: any[]) => {
        //const earringsList = res?.map((animal) => `${animal.earring}`)
        //setFarmEarrings(earringsList)
        dispatch(setFarmAnimals(res))
      })
      listenFarmEvents(farmId as string, (res: any[]) => {
        dispatch(setFarmEvents(res))
      })
    }
  }, [dispatch, farmId, user])

  return {}
}

export default useFarmFarmState
