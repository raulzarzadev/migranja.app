import FarmNavigation from 'components/FarmNavigation'
import useFarm from 'components/hooks/useFarm'
import FarmMenu from 'components/UserHome/FarmMenu'

const FarmPage = () => {
  const { currentFarm } = useFarm()

  return (
    <div>
      <FarmNavigation farm={currentFarm} hiddenGo />
      <FarmMenu farm={currentFarm} />
    </div>
  )
}

export default FarmPage
