import H2 from '@comps/Basics/Title2'
import { Location } from '@comps/LocationPicker'
import WeatherBanner from '@comps/WeatherBanner'
import { FarmType } from '@firebase/Farm/farm.model'
import { getFarm } from '@firebase/Farm/main'
import { UserType } from '@firebase/Users/user.model'
import Icon from 'components/Icon'
import InvitationStatus from 'components/InvitationStatus'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAuthState } from 'store/slices/authSlice'

const FarmNavigation = ({
  farm,
  showGo,
  setEditing,
  showInvitationsStatus
}: {
  farm?: {
    id?: FarmType['id']
    name?: FarmType['name']
  } | null
  showGo?: boolean
  setEditing?: (bool: boolean) => void
  showInvitationsStatus?: boolean
}) => {
  const user = useSelector(selectAuthState)
  const router = useRouter()
  const [dataFarm, setDataFarm] = useState<FarmType | null | any>(null)
  useEffect(() => {
    if (farm?.id)
      getFarm(farm?.id).then((res) => {
        setDataFarm(res)
      })
  }, [farm?.id])
  const areInHome = router.pathname === '/home'
  if (farm?.id && showGo)
    return (
      <Link href={`/${farm?.id}`}>
        <div className=" bg-base-300 rounded-md shadow-md   cursor-pointer active:shadow-inner hover:shadow-none">
          <FarmRow
            farm={{
              name: farm?.name || '',
              id: farm?.id || '',
              coord: dataFarm?.coordinates
            }}
            setEditing={setEditing}
            showInvitationsStatus={showInvitationsStatus}
            user={user}
            showBack={!areInHome}
          />
        </div>
      </Link>
    )
  if (farm?.id)
    return (
      <div className=" bg-base-300 rounded-md shadow-md   ">
        <FarmRow
          farm={{
            name: farm.name || '',
            id: farm?.id || '',
            coord: dataFarm?.coordinates
          }}
          setEditing={setEditing}
          showInvitationsStatus={showInvitationsStatus}
          user={user}
          showBack={!areInHome}
        />
      </div>
    )
  return (
    <>
      <div className=" bg-base-300 rounded-md shadow-md  min-h-12 py-2 ">
        <div className="col-span-full flex justify-center flex-col items-center">
          <div>No haz configurado una propia granja </div>
          {setEditing && (
            <button
              className="btn btn-sm btn-secondary"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setEditing?.(true)
              }}
            >
              Configurar
            </button>
          )}
        </div>
      </div>
    </>
  )
}
const FarmRow = ({
  farm,
  setEditing,
  showInvitationsStatus,
  user,
  showBack = true
}: {
  farm: { name: string; id: string; coord?: Location }
  setEditing?: (bool: boolean) => void
  showInvitationsStatus?: boolean
  user?: UserType | null
  showBack?: boolean
}) => {
  const router = useRouter()
  const atHome = router.pathname === '/'

  return (
    <div className=" w-full  p-2  min-h-12 mb-2 ">
      <div className=" grid grid-flow-col grid-cols-3 place-items-center items-center">
        <span className=" flex ">
          {showBack && (
            <button
              aria-label="go-back-button"
              disabled={atHome}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                router.back()
              }}
              className={'btn btn-sm btn-circle btn-ghost'}
            >
              <Icon name="left" size="sm" />
            </button>
          )}
        </span>
        <H2>{farm.name}</H2>

        <WeatherBanner coord={farm.coord} />
        <div className="flex justify-between">
          {showInvitationsStatus && (
            <InvitationStatus farmId={farm?.id} userId={user?.id} />
          )}
          {setEditing && (
            <button
              className="btn  btn-sm btn-ghost text-gray-800"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setEditing?.(true)
              }}
            >
              <Icon name="settings" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FarmNavigation
