import { NotificationType } from '@firebase/Notifications/notifications.model'
import { fromNow } from 'utils/dates/myDateUtils'
export interface NotificationList {
  notifications: NotificationType[]
  onNotificationClick: (id: string) => void
  askForNotificationsPermissions: () => void
  showAskForNotification: boolean
}
const NotificationsList = ({
  notifications,
  onNotificationClick,
  askForNotificationsPermissions,
  showAskForNotification
}: NotificationList) => {
  const newNotifications = notifications.filter(({ viewed }) => !viewed)
  return (
    <div className="dropdown dropdown-end" role="notification-bell">
      <button tabIndex={0} className="btn btn-ghost btn-circle">
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
            <span
              className="badge badge-xs badge-warning indicator-item"
              role="bell-badge-active"
            >
              {newNotifications.length}
            </span>
          )}
        </div>
      </button>
      <ul
        tabIndex={0}
        className=" dropdown-content mt-3 p-1 shadow bg-base-100 rounded-box w-52"
        role="notifications-list"
      >
        {showAskForNotification && (
          <div>
            <button
              className="btn btn-sm btn-info"
              onClick={(e) => {
                e.preventDefault()
                askForNotificationsPermissions()
              }}
            >
              Permitir notificaciónes
            </button>
          </div>
        )}
        {!notifications.length && (
          <span role={'any-notifications-label'} className="text-sm">
            Aún no tienes notificaciones
          </span>
        )}
        {notifications.map(({ viewed, id, createdAt, message }) => (
          <li key={id} role="notification">
            <button
              className="flex items-center"
              onClick={() => onNotificationClick(id)}
              role={`notification-${viewed ? 'viewed' : 'new'}`}
            >
              <span
                className={`badge badge-xs ${
                  viewed ? 'badge-ghost ' : 'badge-warning '
                }indicator-item mr-0.5`}
              />

              <div className="text-start">
                <div className="text-end">
                  <span className="text-xs text-end">
                    {createdAt && fromNow(createdAt, { addSuffix: true })}
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
export default NotificationsList
