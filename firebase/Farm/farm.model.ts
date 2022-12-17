import { ImageType } from '@firebase/types.model.ts/ImageType.model'
import { DateType, TypeBase } from '@firebase/types.model.ts/TypeBase.model'
import { UserType } from '@firebase/Users/user.model'

export interface FarmType extends TypeBase {
  name: string
  haveATeam?: boolean
  team: MemberTeam[]
  images: ImageType[]
  email?: string
}

export interface PermissionOption {
  id: 'sheep' | 'permissions' | 'events' | 'farms'
  expireAt: DateType
}

export interface Permission {
  canEdit: PermissionOption[] | 'all'
  canDelete: PermissionOption[] | 'all'
  canRead: PermissionOption[] | 'all'
  canCreate: PermissionOption[] | 'all'
}

export interface MemberTeam {
  email: string
  name?: string
  id: UserType['id']
  permissions?: Permission
  invitation?: {
    accepted: boolean
    sent: boolean
    acceptedAt?: DateType
    sentAt?: DateType
  }
}

export interface CreateFarmDTO extends Partial<FarmType> {}
