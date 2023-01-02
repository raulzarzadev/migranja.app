import { render, screen } from '@testing-library/react'
import FarmEvents, { EventDetails, EventModal, FarmEvent } from '.'

describe('Farm Events List', () => {
  const FARM_EVENT: FarmEvent = {
    id: '1'
  }
  const FARM_EVENTS: FarmEvent[] = [FARM_EVENT]
  it('Farm Events List', () => {
    const component = render(<FarmEvents events={FARM_EVENTS} />)
    component.getByRole('events-list')
    // screen.debug()
  })

  it(' Farm event ', () => {
    const component = render(<FarmEvent event={FARM_EVENT} />)
    component.getByRole('farm-event')
  })

  it(' Farm Details Modal', () => {
    const component = render(<EventModal event={FARM_EVENT} />)
    component.getByText('Detalles del Evento')
  })
})
