import useAuth from 'components/hooks/useAuth'
import useDebugInformation from 'components/hooks/useDebugInformation'
import useFarm from 'components/hooks/useFarm'
import Loading from 'components/Loading'
import UserFarm from 'components/UserFarm'
import FarmMenu from 'components/UserHome/FarmMenu'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const FarmPage = () => {
  //const { currentFarm } = useFarm()
  // if (!currentFarm) return <Loading />
  useDebugInformation('FarmPage', {})

  return (
    <div>
      <UserFarm />
      <FarmMenu />
    </div>
  )
}

export default FarmPage
