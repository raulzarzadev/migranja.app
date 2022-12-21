import { updateNotification } from '@firebase/Notifications/main'
import { NotificationType } from '@firebase/Notifications/notifications.model'
import useNotifications from 'components/hooks/useNotifications'
import { useEffect, useState } from 'react'
import NotificationsList from './NotificationsList'

const UserNotifications = () => {
  const { userNotifications } = useNotifications()
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  useEffect(() => {
    userNotifications((res: NotificationType[]) => setNotifications(res))
  }, [userNotifications])
  const handleClickNotification = (id: string) => {
    updateNotification(id, { viewed: true })
  }
  return (
    <NotificationsList
      notifications={notifications}
      onNotificationClick={handleClickNotification}
    />
  )
}

export default UserNotifications
