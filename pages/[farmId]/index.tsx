import FarmNavigation from 'components/FarmNavigation'
import withAuth from 'components/HOCs/withAuth'
import useFarmFarmState from 'components/hooks/useFarmFarmState'
import FarmMenu from 'components/UserHome/FarmMenu'
import { useSelector } from 'react-redux'
import { selectFarmState } from 'store/slices/farmSlice'

const FarmPage = () => {
  useFarmFarmState() // Set the farm state, farm info, farm animals , and events
  const currentFarm = useSelector(selectFarmState)
  return (
    <div>
      <FarmNavigation
        farm={currentFarm}
        showGo={undefined}
        setEditing={undefined}
      />
      <FarmMenu />
    </div>
  )
}

export default withAuth(FarmPage)
