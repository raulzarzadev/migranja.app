import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { ImageType } from '@firebase/types.model.ts/ImageType.model'
import { DateType, TypeBase } from '@firebase/types.model.ts/TypeBase.model'
import { UserType } from '@firebase/Users/user.model'

export interface FarmType extends TypeBase {
  name: string
  haveATeam?: boolean
  team: Record<MemberTeam['id'], MemberTeam>
  images: ImageType[]
  email?: string
  animals?: AnimalType[]
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
export type InvitationStatusType =
  | 'ACCEPTED'
  | 'REJECTED'
  | 'SENT'
  | 'PENDING_TO_SEND'
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
    status?: InvitationStatusType
  }
}

export interface CreateFarmDTO extends Partial<FarmType> {}
