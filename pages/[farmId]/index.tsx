import useAuth from 'components/hooks/useAuth'
import useDebugInformation from 'components/hooks/useDebugInformation'
import useFarm from 'components/hooks/useFarm'
import Loading from 'components/Loading'
import UserFarm from 'components/UserFarm'
import FarmMenu from 'components/UserHome/FarmMenu'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmState } from 'store/slices/farmSlice'

const FarmPage = () => {
  //const { currentFarm } = useFarm()
  // useDebugInformation('FarmPage', {})
  // const currentFarm = useSelector(selectFarmState)
  // if (!currentFarm) return <Loading />

  return (
    <div>
      <UserFarm />
      <FarmMenu />
    </div>
  )
}

export default FarmPage
