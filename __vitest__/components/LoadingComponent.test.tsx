import { expect, test } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Loading from '@comps/Loading'

test('home', () => {
  render(<Loading />)
  const loading = within(screen.getByRole('loading'))
})
