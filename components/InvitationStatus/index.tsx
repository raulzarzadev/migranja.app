import { FarmType, MemberTeam } from '@firebase/Farm/farm.model'
import { updateFarm } from '@firebase/Farm/main'
import useNotifications from 'components/hooks/useNotifications'
import Icon from 'components/Icon'

const InvitationStatus = ({
  memberTeam,
  farm
}: {
  memberTeam: MemberTeam
  farm: FarmType
}) => {
  const { invitation, id, name, email } = memberTeam
  const { sendNotification } = useNotifications()

  const handleSendInvitation = async ({
    to: { id, name, email }
  }: {
    to: { id: string; name: string; email: string }
  }) => {
    return sendNotification({
      type: 'farm-invitation',
      to: {
        email: email,
        id: id,
        name: name
      },
      from: {
        email: farm?.email ?? '',
        id: farm?.id ?? '',
        name: farm?.name ?? ''
      },
      options: {
        message: `Invitación de ${farm?.name} a colaborar con ellos. `
      }
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }
  const handleUpdateTeamMemberInvitation = (
    userId: string,
    { invitation }: any
  ) => {
    farm?.id &&
      updateFarm(farm?.id, { [`team.${userId}.invitation`]: invitation })
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
  }

  return (
    <div>
      <div>{invitation?.accepted && <Icon name="done" />}</div>
      <div>
        {invitation?.sent && !invitation?.accepted && <Icon name="time" />}
      </div>
      <div>
        {!invitation?.sent && (
          <button
            onClick={(e) => {
              e.preventDefault()
              handleUpdateTeamMemberInvitation(id, {
                email,
                id,
                name: name,
                invitation: { sent: true, accepted: false }
              })
              handleSendInvitation({
                to: { email, id, name: name || '' }
              })
            }}
          >
            <Icon name="send" />
          </button>
        )}
      </div>
    </div>
  )
}

export default InvitationStatus
