import { FarmType } from '@firebase/Farm/farm.model'
import useFarm from 'components/hooks/useFarm'
import FarmMenu from 'components/UserHome/FarmMenu'

const FarmPage = () => {
  const { currentFarm } = useFarm()
  return (
    <div>
      <Farm farm={currentFarm} />
      <FarmMenu farm={currentFarm} />
    </div>
  )
}

const Farm = ({ farm }: { farm: FarmType | null }) => {
  const farmTeam =
    farm?.team && Object?.entries(farm?.team)?.map(([key, value]) => value)
  return (
    <div>
      <div className="flex w-full bg-base-300 p-2 rounded-md shadow-md justify-evenly mb-2 items-center">
        <>
          <div>{farm?.images?.[0]?.url}</div>
          <div>{farm?.name}</div>
          <div>
            Equipo status :{' '}
            {farm?.haveATeam ? `Activo (${farmTeam?.length})` : 'Dasactivado'}
          </div>
        </>
      </div>
    </div>
  )
}

export default FarmPage
