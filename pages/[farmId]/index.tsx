import { FarmType } from '@firebase/Farm/farm.model'
import { getFarm } from '@firebase/Farm/main'
import FarmMenu from 'components/UserHome/FarmMenu'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectFarmState, setFarmState } from 'store/slices/farmSlice'

const FarmPage = () => {
  //  const [farm, setFarm] = useState<FarmType | null>(null)
  const {
    query: { farmId }
  } = useRouter()
  const dispatch = useDispatch()
  const farm = useSelector(selectFarmState)

  useEffect(() => {
    farmId &&
      getFarm(`${farmId}`).then((res) => {
        dispatch(setFarmState(res))
      })
  }, [farmId])

  if (!farm) return <></>

  return (
    <div>
      <Farm farm={farm} />
      <FarmMenu farm={farm} />
    </div>
  )
}

const Farm = ({ farm }: { farm: FarmType }) => {
  const farmTeam =
    farm && Object?.entries(farm?.team)?.map(([key, value]) => value)
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
