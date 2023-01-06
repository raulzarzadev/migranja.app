import Icon from 'components/Icon'
import React, { useId, useState } from 'react'

const Modal = ({
  title = 'Modal title',
  children = <></>,
  size = 'full',
  openComponent
}: {
  title: string
  children: any
  size?: 'full' | 'half'
  openComponent?: (props: any) => React.ReactNode
}) => {
  const modalId = useId()
  const sizing = {
    full: 'w-full',
    half: 'w-1/2'
  }
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }
  return (
    <>
      {openComponent?.({
        onClick: (e: any) => {
          e.preventDefault()
          handleOpenModal()
        }
      }) || (
        <button
          onClick={(e) => {
            e.preventDefault()
            handleOpenModal()
          }}
        >
          Abrir modal
        </button>
      )}
      <div
        className={`top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black bg-opacity-50 z-30 ${
          openModal ? 'fixed' : 'hidden'
        } `}
        id={modalId}
        onClick={(e) => {
          e.stopPropagation()
          const target = e.target as HTMLDivElement
          target?.id === modalId && handleOpenModal()
        }}
      >
        <div
          className={`bg-base-100 overflow-auto max-h-full rounded-lg w-full max-w-xl ${sizing[size]} `}
        >
          <header
            className={
              'flex justify-between sticky top-0 bg-base-100 z-10 px-3 py-1'
            }
          >
            <div className={''}>
              <h5 className="font-bold max-w-[180px] truncate">{title}</h5>
            </div>
            <button
              className={''}
              onClick={(e) => {
                e.preventDefault()
                handleOpenModal()
              }}
            >
              <Icon name="close" size="md" />
            </button>
          </header>
          <main className={'pt-5 p-5'}>{children}</main>
        </div>
      </div>
    </>
  )
}

export default Modal
