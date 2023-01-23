import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAuthState } from 'store/slices/authSlice'
import { FarmType } from 'types/base/FarmType.model'

export interface UserPermissions {
  isAdmin?: boolean
  isActiveTeamMember?: boolean
  haveActiveInvitation?: boolean
}
const useUserFarmPermissions = ({ farm }: { farm?: FarmType | null }) => {
  const [userPermissions, setUserPermissions] = useState<UserPermissions>({})
  const user = useSelector(selectAuthState)
  useEffect(() => {
    const teamMember = farm?.team[user?.id || '']
    const teamMemberInvitationStatus = teamMember?.invitation?.status
    const isActiveTeamMember =
      farm?.haveATeam && teamMemberInvitationStatus === 'ACCEPTED'
    const isAdmin = farm?.userId == user?.id
    const haveActiveInvitation = teamMemberInvitationStatus === 'SENT'

    setUserPermissions((state) => {
      return {
        ...state,
        isActiveTeamMember: isActiveTeamMember,
        isAdmin,
        haveActiveInvitation
      }
    })
  }, [user, farm])

  return { userPermissions }
}
export default useUserFarmPermissions
