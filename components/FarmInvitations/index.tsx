import { FarmType } from '@firebase/Farm/farm.model'
import { getInvitationsFarm, updateFarm } from '@firebase/Farm/main'
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
        <div
          key={i}
          className="flex w-full bg-base-300 p-2 rounded-md shadow-md justify-evenly mb-2 items-center"
        >
          <div>{farm.name}</div>
          <div className="flex">
            Status
            <InvitationStatus farm={farm} memberTeam={farm.team?.[user?.id]} />
          </div>
          {farm.team[user.id].invitation?.accepted ? (
            <div className="flex">
              <div>
                <Link href={`/${farm.id}`} className="btn btn-sm  mr-1">
                  ir
                </Link>
              </div>
              <button
                className="btn btn-sm btn-outline"
                disabled
                onClick={() =>
                  handleUpdateInvitation({
                    farmId: farm.id,
                    userId: user?.id,
                    acceptInvitation: false
                  })
                }
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div>
              <button
                className="btn btn-sm btn-outline btn-primary"
                onClick={() =>
                  handleUpdateInvitation({
                    farmId: farm.id,
                    userId: user?.id,
                    acceptInvitation: true
                  })
                }
              >
                Acceptar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default FarmInvitations
