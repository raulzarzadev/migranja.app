import { updateNotification } from '@firebase/Notifications/main'
import { NotificationType } from '@firebase/Notifications/notifications.model'
import useNotifications from 'components/hooks/useNotifications'
import { useEffect, useState } from 'react'
import NotificationsList from './NotificationsList'

const UserNotifications = () => {
  const { userNotifications } = useNotifications()
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [showAskForNotification, setShowAskForNotification] =
    useState<boolean>(false)
  const [notificationPermissions, setNotificationPermissions] = useState<
    'granted' | 'default' | 'denied' | 'not_support'
  >()

  const [newNotifications, setNewNotifications] = useState<NotificationType[]>(
    []
  )

  const createNotifications = (notifications: NotificationType[]) => {
    notifications.forEach((notification) => {
      const notifTitle = notification.type
      const notifBody = notification.message
      const notifImg = '/assets/notification-image.png'
      const options = {
        body: notifBody,
        icon: notifImg
      }
      new Notification(notifTitle, options)
      console.log('Notification created')
    })
  }

  const handleClickNotification = (id: string) => {
    updateNotification(id, { viewed: true })
  }

  const handleAskForNotificationsPermissions = () => {
    if (!(notificationPermissions === 'not_support')) {
      Notification.requestPermission().then((response) => {
        setNotificationPermissions(response)
      })
    }
  }

  useEffect(() => {
    userNotifications((res: NotificationType[]) => {
      setNewNotifications(res?.filter(({ viewed }) => !viewed))
      setNotifications(res)
    })
  }, [userNotifications])

  useEffect(() => {
    if (!('Notification' in window)) {
      setNotificationPermissions('not_support')
    } else {
      setNotificationPermissions(Notification.permission)
    }
  }, [])

  useEffect(() => {
    /* ******************************************** 
           Create notifications                
 *******************************************rz */
    if (newNotifications.length) {
      createNotifications(newNotifications)
      console.count()
    }
  }, [newNotifications])

  return (
    <NotificationsList
      notifications={notifications}
      onNotificationClick={handleClickNotification}
      askForNotificationsPermissions={handleAskForNotificationsPermissions}
      showAskForNotification={showAskForNotification}
    />
  )
}

export default UserNotifications
