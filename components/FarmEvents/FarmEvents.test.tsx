import { render, screen } from '@testing-library/react'
import FarmEvents from '.'

describe('User notifications', () => {
  it('Farm Events List', () => {
    const FARM_EVENTS = [
      {
        id: '1'
      }
    ]
    const component = render(<FarmEvents events={FARM_EVENTS} />)

    // screen.debug()
  })
})
