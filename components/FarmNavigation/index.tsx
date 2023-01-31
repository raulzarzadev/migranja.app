import H2 from '@comps/Basics/Title2'
import { FarmType } from '@firebase/Farm/farm.model'
import { UserType } from '@firebase/Users/user.model'
import Icon from 'components/Icon'
import InvitationStatus from 'components/InvitationStatus'
import Link from 'next/link'
import { useRouter } from 'next/router'
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
  if (farm?.id && showGo)
    return (
      <Link href={`/${farm?.id}`}>
        <div className=" bg-base-300 rounded-md shadow-md   cursor-pointer active:shadow-inner hover:shadow-none">
          <FarmRow
            farm={{
              name: farm?.name || '',
              id: farm?.id || ''
            }}
            setEditing={setEditing}
            showInvitationsStatus={showInvitationsStatus}
            user={user}
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
            id: farm?.id || ''
          }}
          setEditing={setEditing}
          showInvitationsStatus={showInvitationsStatus}
          user={user}
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
  user
}: {
  farm: { name: string; id: string }
  setEditing?: (bool: boolean) => void
  showInvitationsStatus?: boolean
  user?: UserType | null
}) => {
  const router = useRouter()
  const atHome = router.pathname === '/'
  return (
    <div className=" w-full  p-2  min-h-12 mb-2 ">
      <div className=" grid grid-flow-col grid-cols-3 place-items-center items-center">
        <span className=" flex ">
          <button
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
        </span>
        <H2>{farm.name}</H2>
        <div className="flex justify-between">
          {showInvitationsStatus && (
            <InvitationStatus farmId={farm?.id} userId={user?.id} />
          )}
          {setEditing && (
            <button
              className="btn  btn-sm btn-ghost text-info"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setEditing?.(true)
              }}
            >
              <Icon name="edit" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FarmNavigation
