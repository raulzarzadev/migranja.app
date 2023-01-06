import { listenFarmAnimals } from '@firebase/Animal/main'
import { listenFarmEvents } from '@firebase/Events/main'
import { getUserFarm, listenFarm } from '@firebase/Farm/main'
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

const useFarmState = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectAuthState)

  const {
    query: { farmId }
  } = useRouter()

  useEffect(() => {
    user &&
      getUserFarm(user.id).then((res) => {
        dispatch(setUserFarm(res))
      })
  }, [dispatch, user])

  useEffect(() => {
    if (user && farmId) {
      listenFarm(farmId as string, (res: any) => {
        dispatch(setFarmState(res))
      })
      listenFarmAnimals(farmId as string, (res: any[]) => {
        dispatch(setFarmAnimals(res))
      })
      listenFarmEvents(farmId as string, (res: any[]) => {
        dispatch(setFarmEvents(res))
      })
    }
  }, [dispatch, farmId, user])

  return {}
}

export default useFarmState
