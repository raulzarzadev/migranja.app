import {
  createNotification,
  listenUserNotifications
} from '@firebase/Notifications/main'
import { NotificationType } from '@firebase/Notifications/notifications.model'
interface SendNotification {
  type: NotificationType['type']
  to: NotificationType['directedTo']
  from: NotificationType['createdBy']
  options?: {
    message: string
  }
}

const userNotifications = (cb: CallableFunction) => {
  listenUserNotifications(cb)
}
const useNotifications = () => {
  const sendNotification = async ({
    type,
    to,
    from,
    options
  }: SendNotification) =>
    await createNotification({
      type,
      directedTo: to,
      createdBy: from,
      message: options?.message
    })

  return { sendNotification, userNotifications }
}

export default useNotifications
