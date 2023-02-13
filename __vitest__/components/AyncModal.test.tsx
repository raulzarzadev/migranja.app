import { expect, test, it, describe, afterEach } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import AsyncModal from '@comps/modal/AsyncModal'

describe('Progress button', () => {
  afterEach(cleanup)
  it('should render', () => {
    render(
      <AsyncModal
        btnLabel="Async modal"
        handleAccept={function (): Promise<number | boolean> {
          throw new Error('Function not implemented.')
        }}
        modalTitle={'Testing modal'}
      >
        <>Hola</>
      </AsyncModal>
    )
  })
})
