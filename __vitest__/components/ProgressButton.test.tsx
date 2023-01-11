import { expect, test, it, describe, afterEach } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import ProgressButton from '@comps/ProgressButton'

describe('Progress button', () => {
  afterEach(cleanup)
  it('should render', () => {
    render(<ProgressButton progress={0} />)
  })
  it('should be loading and disable save button', () => {
    render(<ProgressButton progress={10} />)
    screen.getByRole('loading')
    const btn = screen.getByRole('button')
    expect(btn).toHaveProperty('disabled', true)
  })
  it('should show ready label ', () => {
    render(<ProgressButton progress={100} />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveProperty('disabled', true)
    screen.getByText('Listo.')
  })
})
