import { TypeBase } from '@firebase/types.model.ts/TypeBase.model'
import { UserType } from '@firebase/Users/user.model'

export interface NotificationType extends TypeBase {
  createdBy: UserType['id']
  directedTo: UserType['id']
  type: 'farm-invitation' | 'app-actualization'
  message: string
}

export interface CreateNotificationDTO extends Partial<NotificationType> {}
