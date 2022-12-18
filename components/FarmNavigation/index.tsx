import { FarmType } from '@firebase/Farm/farm.model'
import useAuth from 'components/hooks/useAuth'
import Icon from 'components/Icon'
import InvitationStatus from 'components/InvitationStatus'
import Link from 'next/link'

const FarmNavigation = ({
  farm,
  setEditing,
  hiddenGo = false
}: {
  farm?: FarmType | null
  setEditing?: (bool: boolean) => void
  hiddenGo?: boolean
}) => {
  const { user } = useAuth()
  const farmInvitationIsAccepted = (userId?: string) =>
    farm?.team?.[userId || '']?.invitation?.accepted

  const canVisitFarm =
    farmInvitationIsAccepted(user?.id) || farm?.userId === user?.id
  return (
    <div className="flex w-full bg-base-300 p-2 rounded-md shadow-md justify-between mb-2 items-center">
      {farm ? (
        <>
          {/* <div>{farm?.images?.[0]?.url}</div> */}
          <div>{farm?.name}</div>
          <div className="flex w-[110px] justify-between">
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
            <InvitationStatus farmId={farm?.id} userId={user?.id} />
            <div>
              {!hiddenGo && canVisitFarm && (
                <Link href={`/${farm.id}`} className="btn btn-sm  mr-1">
                  ir
                </Link>
              )}
            </div>
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
    </div>
  )
}

export default FarmNavigation
