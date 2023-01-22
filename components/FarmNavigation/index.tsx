import { FarmType } from '@firebase/Farm/farm.model'
import Icon from 'components/Icon'
import InvitationStatus from 'components/InvitationStatus'
import Link from 'next/link'
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
  }
  showGo?: boolean
  setEditing?: (bool: boolean) => void
  showInvitationsStatus?: boolean
}) => {
  const user = useSelector(selectAuthState)
  return (
    <div>
      <div className=" w-full bg-base-300 p-2 rounded-md shadow-md  mb-2  grid grid-flow-col grid-cols-4 place-items-center ">
        {farm ? (
          <>
            {/* <div>{farm?.images?.[0]?.url}</div> */}
            <span>
              {setEditing && (
                <button
                  className="btn btn-circle btn-sm btn-info"
                  onClick={() => setEditing?.(true)}
                >
                  <Icon name="edit" size="xs" />
                </button>
              )}
            </span>
            <div className="text-xl font-bold">{farm?.name}</div>
            <div className="flex justify-between  items-center">
              {showGo && farm?.id && (
                <Link href={`/${farm.id}`} className="btn btn-sm  mr-1">
                  ir
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="flex w-full items-center justify-center">
            <div>No haz configurado una granja aún </div>
            {setEditing && (
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setEditing?.(true)}
              >
                Configurar
              </button>
            )}
          </div>
        )}
        <span>
          {showInvitationsStatus && (
            <InvitationStatus farmId={farm?.id} userId={user?.id} />
          )}
        </span>
      </div>
    </div>
  )
}

export default FarmNavigation
