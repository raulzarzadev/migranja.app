import { TypeBase } from '@firebase/types.model.ts/TypeBase.model'
import { UserType } from '@firebase/Users/user.model'

export interface NotificationType extends TypeBase {
  createdBy: {
    id: UserType['id']
    name: UserType['name']
    email: UserType['email']
  }
  directedTo: {
    id: UserType['id']
    name: UserType['name']
    email: UserType['email']
  }
  title: string
  type: 'farm-invitation' | 'app-actualization'
  message: string
  viewed?: boolean
}

export interface CreateNotificationDTO extends Partial<NotificationType> {}
