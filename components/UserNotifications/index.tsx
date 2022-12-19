import { updateNotification } from '@firebase/Notifications/main'
import { NotificationType } from '@firebase/Notifications/notifications.model'
import useNotifications from 'components/hooks/useNotifications'
import { useEffect, useState } from 'react'
import { fromNow } from 'utils/dates/myDateUtils'

const UserNotifications = () => {
  const { userNotifications } = useNotifications()
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  useEffect(() => {
    userNotifications((res: NotificationType[]) => setNotifications(res))
  }, [userNotifications])
  const handleClickNotification = (id: string) => {
    updateNotification(id, { viewed: true })
  }
  const newNotifications = notifications?.filter(({ viewed }) => !viewed)
  const [allowNotifications, setAllowNotifications] = useState(false)
  useEffect(() => {
    const browserNotifications = (notifications: NotificationType[]) => {
      notifications.forEach((notification) => {
        console.log('notification created')
        const notifTitle = notification.type
        const notifBody = notification.message
        const notifImg = ''
        const options = {
          body: notifBody,
          icon: notifImg
        }
        const greeting = new Notification(notifTitle, options)
        console.log(greeting)
      })
    }
    browserNotifications(newNotifications)
  }, [newNotifications, allowNotifications])

  const handleAskForNotificationsPermissions = () => {
    Notification.requestPermission().then((result) => {
      if (result === 'granted') {
        setAllowNotifications(true)
      }
    })
  }

  useEffect(() => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications.')
    } else if (!allowNotifications) {
      Notification.requestPermission().then((permission) => {
        permission === 'granted' && setAllowNotifications(true)
      })
    } else {
      setAllowNotifications(Notification.permission === 'granted')
      console.log('set notifications')
      // Notification.requestPermission((permission) => {
      // })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle">
        <div className="indicator">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {!!newNotifications.length && (
            <span className="badge badge-xs badge-warning indicator-item">
              {newNotifications.length}
            </span>
          )}
        </div>
      </label>
      <ul
        tabIndex={0}
        className=" dropdown-content mt-3 p-1 shadow bg-base-100 rounded-box w-52"
      >
        {allowNotifications || (
          <div>
            <button
              className="btn btn-sm btn-info"
              onClick={(e) => {
                e.preventDefault()
                handleAskForNotificationsPermissions()
              }}
            >
              Permitir notificaciónes
            </button>
          </div>
        )}
        {notifications.map(({ viewed, id, createdAt, message }) => (
          <li key={id}>
            <button
              className="flex items-center"
              onClick={() => handleClickNotification(id)}
            >
              <span
                className={`badge badge-xs ${
                  viewed ? 'badge-ghost ' : 'badge-warning '
                }indicator-item mr-0.5`}
              />

              <div className="text-start">
                <div className="text-end">
                  <span className="text-xs text-end">
                    {fromNow(createdAt, { addSuffix: true })}
                  </span>
                </div>
                <div>
                  <span className="text-sm">{message}</span>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserNotifications
