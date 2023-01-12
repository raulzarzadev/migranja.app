import Icon from 'components/Icon'
import React, { useId } from 'react'

const Modal = ({
  title = 'Modal title',
  open = false,
  handleOpen,
  children = <></>,
  onMouseLeave,
  size = 'full'
}: {
  title: string
  open: boolean
  handleOpen: () => void
  children: any
  onMouseLeave?: any
  size?: 'full' | 'half'
}) => {
  const modalId = useId()
  const sizing = {
    full: 'w-full',
    half: 'w-1/2'
  }
  return (
    <div
      className={`top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black bg-opacity-50 z-30 ${
        open ? 'fixed' : 'hidden'
      } `}
      id={modalId}
      onClick={(e) => {
        e.stopPropagation()
        const target = e.target as HTMLDivElement
        target?.id === modalId && handleOpen()
      }}
    >
      <div
        onMouseLeave={onMouseLeave}
        className={`bg-base-100 overflow-auto max-h-full rounded-lg w-full max-w-xl ${sizing[size]} `}
      >
        <header
          className={
            'flex justify-between sticky top-0 bg-base-100 z-[1] px-3 py-1'
          }
        >
          <div className={''}>
            <h5 className="font-bold max-w-[180px] truncate">{title}</h5>
          </div>
          <button
            className={''}
            onClick={(e) => {
              e.preventDefault()
              handleOpen()
            }}
          >
            <Icon name="close" size="md" />
          </button>
        </header>
        <main className={'pt-5 p-5'}>{children}</main>
      </div>
    </div>
  )
}

export default Modal
