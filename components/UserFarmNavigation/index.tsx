import { listenFarm } from '@firebase/Farm/main'
import FarmNavigation from 'components/FarmNavigation'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectFarmState, setFarmState } from 'store/slices/farmSlice'

const UserFarmNavigation = ({
  setEditing
}: {
  setEditing: (bool: boolean) => void
}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const currentFarmId = router?.query?.farmId
  useEffect(() => {
    currentFarmId &&
      listenFarm(currentFarmId as string, (res: any) => {
        dispatch(setFarmState(res))
      })
  }, [currentFarmId, dispatch])
  const farm = useSelector(selectFarmState)
  const showGo = farm?.id !== currentFarmId
  return <FarmNavigation farm={farm} setEditing={setEditing} showGo={showGo} />
}

export default UserFarmNavigation
