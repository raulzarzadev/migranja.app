import FarmNavigation from 'components/FarmNavigation'
import withAuth from 'components/HOCs/withAuth'
import FarmMenu from 'components/UserHome/FarmMenu'
import { useSelector } from 'react-redux'
import { selectFarmState } from 'store/slices/farmSlice'

const FarmPage = () => {
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
