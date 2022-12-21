import {
  FarmType,
  InvitationStatus,
  MemberTeam
} from '@firebase/Farm/farm.model'
import { updateFarm } from '@firebase/Farm/main'
import { UserType } from '@firebase/Users/user.model'
import useAuth from 'components/hooks/useAuth'
import useFarm from 'components/hooks/useFarm'
import useNotifications from 'components/hooks/useNotifications'
import Icon from 'components/Icon'
import Modal from 'components/modal/Modal_v2'
import { ReactNode } from 'react'

const InvitationStatus = ({
  farmId,
  userId
}: {
  farmId?: string
  userId?: string
}) => {
  const { user } = useAuth()
  const { farmData: farm } = useFarm({ getFarmById: farmId })
  const teamMember = farm?.team?.[userId || '']

  const isAdmin = farm?.userId === user?.id
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
      title: 'Únete a nosotros.',
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
  const handleUpdateInvitation = ({ status }: { status: InvitationStatus }) => {
    farmId &&
      updateFarm(farmId, {
        [`team.${userId}.invitation.status`]: status
      }).then((res) => console.log(res))
  }

  const invitationStatus: InvitationStatus = teamMember?.invitation?.status

  const invitationSentBy = farm?.name
  const memberId = teamMember?.id
  const memberEmail = teamMember?.email
  const memberName = teamMember?.name

  const STATUSES: Record<InvitationStatus, ReactNode> = {
    ACCEPTED: (
      <>
        <Modal
          title="Rechazar invitación"
          openComponent={(props) => (
            <button {...props} className="btn btn-sm btn-circle btn-success">
              <Icon name="done" />{' '}
            </button>
          )}
        >
          <div>
            <div className="text-center">
              <div>Rechazar invitación</div>
            </div>
            <div className="flex justify-center mt-2">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleAcceptInvitation({
                    farmId,
                    userId,
                    acceptInvitation: false
                  })
                  handleUpdateInvitation({ status: 'REJECTED' })
                }}
                className="btn btn-error "
              >
                {isAdmin ? 'Cancelar' : 'Rechazar'}
                <span className="ml-1">
                  <Icon name="close" />
                </span>
              </button>
            </div>
          </div>
        </Modal>
      </>
    ),
    REJECTED: (
      <Modal
        title="Acceptar invitacion"
        openComponent={(props) => (
          <button {...props} className="btn btn-sm btn-circle btn-ghost">
            <Icon name="close" />
          </button>
        )}
      >
        <div className="text-center max-w-[300px]  mx-auto whitespace-normal">
          <p className="my-2">
            Esta invitación fue cancelada por alguna de las dos partes
          </p>
          <p>
            Pongase en contacto con el administrador para aclarar la situación
          </p>
          {isAdmin && (
            <button
              className="btn btn-sm  btn-outline "
              onClick={() => {
                handleUpdateInvitation({ status: 'SENT' })
                handleSendInvitation({
                  to: {
                    email: memberEmail || '',
                    id: memberId || '',
                    name: memberName || ''
                  }
                })
              }}
            >
              Reenviar
            </button>
          )}
        </div>
      </Modal>
    ),
    SENT: (
      <Modal
        title="Acceptar invitacion"
        openComponent={(props) => (
          <button {...props} className="btn btn-sm btn-circle btn-info">
            <Icon name="time" />
          </button>
        )}
      >
        <div>
          <div className="text-center ">
            Aceptar invitación de <strong>{invitationSentBy}</strong> para
            colaborar con ellos
          </div>
          <div className="flex w-full justify-evenly mt-2">
            <button
              onClick={(e) => {
                e.preventDefault()

                handleUpdateInvitation({ status: 'ACCEPTED' })
              }}
              className="btn btn-success"
            >
              Acceptar
              <span className="ml-1">
                <Icon name="done" />
              </span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()

                handleUpdateInvitation({ status: 'REJECTED' })
              }}
              className="btn btn-error"
            >
              Rechazar
              <span className="ml-1">
                <Icon name="close" />
              </span>
            </button>
          </div>
        </div>
      </Modal>
    ),
    PENDING_TO_SEND: (
      <button
        onClick={(e) => {
          e.preventDefault()
          memberId &&
            handleUpdateTeamMemberInvitation(memberId, {
              email: memberEmail,
              id: memberId,
              name: memberName,
              invitation: { sent: true, accepted: false, status: 'SENT' }
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
    )
  }
  return <div>{STATUSES?.[invitationStatus]}</div>
}

export default InvitationStatus
