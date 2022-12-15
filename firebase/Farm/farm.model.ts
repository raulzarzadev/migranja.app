import { DateType, TypeBase } from '@firebase/types.model.ts/TypeBase.model'
import { UserType } from '@firebase/Users/user.model'

export interface FarmType extends TypeBase {
  name: string
  team: MemberTeam[]
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
  id: UserType['id']
  permissions: Permission
}

export interface CreateFarmDTO extends Partial<FarmType> {}
