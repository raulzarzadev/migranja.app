import H2 from '@comps/Basics/Title2'
import { FarmType } from '@firebase/Farm/farm.model'
import { listenUserInvitationsToFarms } from '@firebase/Farm/main'
import FarmNavigation from 'components/FarmNavigation'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAuthState } from 'store/slices/authSlice'

const FarmInvitations = () => {
  const [farmInvitations, setFarmInvitations] = useState<FarmType[]>([])
  const user = useSelector(selectAuthState)
  useEffect(() => {
    const removeOwnFarmInvitations = (invitations: FarmType[]) =>
      invitations.filter(({ userId }) => userId !== user?.id)
    user?.id &&
      listenUserInvitationsToFarms(user.id, (res: FarmType[]) => {
        setFarmInvitations(removeOwnFarmInvitations(res))
      })
  }, [user?.id])

  return (
    <div>
      {!!farmInvitations.length && <H2>Colaboraciones</H2>}
      {farmInvitations.map((invitation, i) => (
        <FarmInvitation
          key={i}
          invitation={{
            status: invitation.team?.[user?.id || '']?.invitation?.status,
            farm: {
              id: invitation.id,
              name: invitation.name
            }
          }}
        />
      ))}
    </div>
  )
}
const FarmInvitation = ({
  invitation
}: {
  invitation: {
    farm: { id: string; name: string }
    status?: 'ACCEPTED' | 'REJECTED' | 'PENDING' | 'SENT' | 'PENDING_TO_SEND'
  }
}) => {
  const farm = invitation.farm
  const user = useSelector(selectAuthState)
  return (
    <>
      <FarmNavigation
        farm={farm}
        showGo={invitation.status === 'ACCEPTED'}
        showInvitationsStatus
      />
    </>
  )
}

export default FarmInvitations
