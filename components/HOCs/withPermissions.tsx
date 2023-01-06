import { FarmType } from '@firebase/Farm/farm.model'
import { UserType } from '@firebase/Users/user.model'
import { useSelector } from 'react-redux'
import { selectAuthState } from 'store/slices/authSlice'
import { selectFarmState } from 'store/slices/farmSlice'

export type Permission = 'ADMIN' | 'MEMBER' | 'ANY'

const PermissionsWrapper = ({
  children,
  permission
}: {
  children?: any
  permission?: Permission
}) => {
  const user = useSelector(selectAuthState)
  const currentFarm = useSelector(selectFarmState)
  const userPermission = definePermission({ user, farm: currentFarm })
  // console.log(userPermission)
  const isAdmin = userPermission === 'ADMIN'
  const isMember = userPermission === 'MEMBER'
  if (isAdmin || isMember) {
    return <>{children}</>
  } else {
    return (
      <div className="flex w-full h-full min-h-[200px] justify-center items-center">
        <span>Permisos insuficientes</span>
      </div>
    )
  }
}

const definePermission = ({
  user,
  farm
}: {
  user?: UserType | null
  farm?: FarmType | null
}): Permission => {
  const isFarmMember = (userId: string): boolean =>
    !!farm?.team[userId] && farm?.team[userId].invitation?.status === 'ACCEPTED'
  if (farm?.userId === user?.id) return 'ADMIN'
  if (isFarmMember(user?.id || '')) return 'MEMBER'
  return 'ANY'
}

export default PermissionsWrapper
