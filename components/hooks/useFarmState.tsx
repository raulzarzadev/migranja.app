import { listenFarmAnimals } from '@firebase/Animal/main'
import { listenFarmEvents } from '@firebase/Events/main'
import {
  getUserFarm,
  getUserFarms,
  listenFarm,
  listenUserFarms
} from '@firebase/Farm/main'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAuthState } from 'store/slices/authSlice'
import {
  setFarmAnimals,
  setFarmEvents,
  setFarmState,
  setUserFarm,
  setUserFarms
} from 'store/slices/farmSlice'
import useDebugInformation from './useDebugInformation'

const useFarmState = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectAuthState)

  const {
    query: { farmId }
  } = useRouter()

  useEffect(() => {
    if (user) {
      getUserFarm(user.id).then((res) => {
        dispatch(setUserFarm(res))
      })
      listenUserFarms((res: any[]) => dispatch(setUserFarms(res)))
    }
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
        console.log('ask events')
        dispatch(setFarmEvents(res))
      })
    }
  }, [dispatch, farmId, user])

  useDebugInformation('useFarmState', { farmId, user })

  return {}
}

export default useFarmState
