import * as React from 'react'
import { render } from '@testing-library/react'
import VisitHome from 'components/VisitHome'

describe('Home', () => {
  it('Render Visit Home', () => {
    const component = render(<VisitHome />)
    component.getByText('Visit Home')
    // screen.debug()
    // check if App components renders headline
  })
})
