import {
  CreateNotificationDTO,
  NotificationType
} from '@firebase/Notifications/notifications.model'
import { render, screen } from '@testing-library/react'
import NotificationsList from './NotificationsList'
import { fireEvent, getAllByRole, prettyDOM } from '@testing-library/dom'

describe('User notifications', () => {
  const notifications: CreateNotificationDTO[] = [
    {
      id: '1',
      type: 'farm-invitation',
      message: 'Mensaje de prueba contenido visto',
      title: 'Mensaje de prueba',
      viewed: true
    },
    {
      id: '2',
      type: 'farm-invitation',
      message: 'Mensaje de prueba contenido NO visto',
      title: 'Mensaje de prueba',
      viewed: false
    }
  ]

  it('renders notification bell', () => {
    const component = render(
      <NotificationsList
        notifications={[]}
        onNotificationClick={(id) => console.log(id)}
      />
    )
    component.getByRole('notification-bell')
  })

  it('Empty notifications list should render label any-notifications', () => {
    const component = render(
      <NotificationsList
        notifications={[]}
        onNotificationClick={(id) => console.log(id)}
      />
    )

    component.getByRole('any-notifications-label')
  })

  it('Should render 2 notification, one viewed and one new', () => {
    const component = render(
      <NotificationsList
        notifications={notifications as NotificationType[]}
        onNotificationClick={(id) => console.log(id)}
      />
    )
    const items = component.getAllByRole('notification')
    const newNotifications = component.getAllByRole('notification-new')
    const viewedNotifications = component.getAllByRole('notification-viewed')

    expect(items).toHaveLength(2)
    expect(newNotifications).toHaveLength(1)
    expect(viewedNotifications).toHaveLength(1)
  })

  it('on notification click should use id notification ', () => {
    const mockHandler = jest.fn()

    const component = render(
      <NotificationsList
        notifications={notifications as NotificationType[]}
        onNotificationClick={mockHandler}
      />
    )
    const notificationViewed = component.getByRole('notification-viewed')
    fireEvent.click(notificationViewed)
    expect(mockHandler.mock.calls).toHaveLength(1)
  })
})
