import { FarmType } from '@firebase/Farm/farm.model'
import { getInvitationsFarm, updateFarm } from '@firebase/Farm/main'
import FarmNavigation from 'components/FarmNavigation'
import useAuth from 'components/hooks/useAuth'
import Icon from 'components/Icon'
import InvitationStatus from 'components/InvitationStatus'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const FarmInvitations = () => {
  const [farmInvitations, setFarmInvitations] = useState<FarmType[]>([])
  const { user } = useAuth()

  useEffect(() => {
    console.log(user?.id)
    user?.id &&
      getInvitationsFarm(user.id).then((res) => setFarmInvitations(res))
  }, [user])

  const handleUpdateInvitation = ({ farmId, userId, acceptInvitation }) => {
    updateFarm(farmId, {
      [`team.${userId}.invitation.accepted`]: acceptInvitation
    }).then((res) => console.log(res))
  }

  return (
    <div>
      {farmInvitations.map((farm, i) => (
        <FarmNavigation key={i} farm={farm} />
      ))}
    </div>
  )
}

export default FarmInvitations
