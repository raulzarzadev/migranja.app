import { FarmType, MemberTeam } from '@firebase/Farm/farm.model'
import { updateFarm } from '@firebase/Farm/main'
import { UserType } from '@firebase/Users/user.model'
import useFarm from 'components/hooks/useFarm'
import useNotifications from 'components/hooks/useNotifications'
import Icon from 'components/Icon'
import Modal from 'components/modal/Modal_v2'

const InvitationStatus = ({
  farmId,
  userId
}: {
  farmId?: string
  userId?: string
}) => {
  const { farmData: farm } = useFarm({ getFarmById: farmId })
  const teamMember = farm?.team?.[userId || '']

  // const { invitation, id, name, email } = teamMember

  const { sendNotification } = useNotifications()
  // ****** Create a notification for user
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

  // ****** Create or update team member invitation
  const handleUpdateTeamMemberInvitation = (
    userId: string,
    { invitation }: any
  ) => {
    farm?.id &&
      updateFarm(farm?.id, { [`team.${userId}.invitation`]: invitation })
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
  }

  const handleAcceptInvitation = ({
    farmId,
    userId,
    acceptInvitation
  }: {
    farmId?: FarmType['id']
    userId?: UserType['id']
    acceptInvitation: boolean
  }) => {
    farmId &&
      updateFarm(farmId, {
        [`team.${userId}.invitation.accepted`]: acceptInvitation
      }).then((res) => console.log(res))
  }

  const invitationAccepted = teamMember?.invitation?.accepted
  const invitationSentBy = farm?.name
  const invitationSent = teamMember?.invitation?.sent
  const memberId = teamMember?.id
  const memberEmail = teamMember?.email
  const memberName = teamMember?.name

  return (
    <div>
      <div>
        {invitationAccepted && (
          <>
            <Modal
              title="Cancelar invitación"
              openComponent={(props) => (
                <button {...props}>
                  <Icon name="done" />{' '}
                </button>
              )}
            >
              <div>
                <div>Cancelar invitación</div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleAcceptInvitation({
                      farmId,
                      userId,
                      acceptInvitation: false
                    })
                  }}
                >
                  Rechazar
                </button>
              </div>
            </Modal>
          </>
        )}
      </div>
      <div>
        {invitationSent && !invitationAccepted && (
          <Modal
            title="Acceptar invitacion"
            openComponent={(props) => (
              <button {...props}>
                <Icon name="time" />{' '}
              </button>
            )}
          >
            <div>
              <div>Accpetar invitación de {invitationSentBy}</div>
              <div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleAcceptInvitation({
                      farmId,
                      userId,
                      acceptInvitation: true
                    })
                  }}
                >
                  Acceptar
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleAcceptInvitation({
                      farmId,
                      userId,
                      acceptInvitation: false
                    })
                  }}
                >
                  Rechazar
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
      <div>
        {!invitationSent && (
          <button
            onClick={(e) => {
              e.preventDefault()
              memberId &&
                handleUpdateTeamMemberInvitation(memberId, {
                  email: memberEmail,
                  id: memberId,
                  name: memberName,
                  invitation: { sent: true, accepted: false }
                })
              memberId &&
                handleSendInvitation({
                  to: {
                    email: memberEmail || '',
                    id: memberId || '',
                    name: memberName || ''
                  }
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
