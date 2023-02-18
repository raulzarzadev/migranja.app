import Icon from '@comps/Icon'
import { IconName } from '@comps/Icon/icons-list'
import Loading from '@comps/Loading'
import { useState } from 'react'
import Modal from '.'

const AsyncModal = ({
  btnLabel = 'label button',
  children = <></>,
  modalTitle = 'Modal title',
  handleAccept = () =>
    new Promise((resolve, reject) => {
      reject('Not implemented')
    }),
  canOpen = true,
  openButtonClassName = '',
  openIcon,
  hiddenButtons = false
}: {
  btnLabel: string | React.ReactNode
  handleAccept: () => Promise<boolean | number>
  modalTitle: string
  children: React.ReactNode
  canOpen?: boolean
  openButtonClassName?: string
  openIcon?: IconName
  hiddenButtons?: boolean
}) => {
  //* Modal handlers
  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(!open)
  }

  //* should execute tha functions and return a progress or a boolean about the state of 0 , 100 , or -1

  //* when you click in save button, actions like loaders of modal should show it
  const onStartActions = () => {
    setProgress(1)
  }

  //* when executing functions finished should show successfully  labels and close modal
  const onFinishAction = () => {
    setProgress(100)
    setTimeout(() => {
      handleOpen()
      setProgress(0)
    }, 1000)
  }

  //* when user cancel action, should wait for a bit and close modal ( should show closing? )

  const handleCancel = () => {
    console.log('canceling')
    setProgress(1)
    setTimeout(() => {
      handleOpen()
      setProgress(0)
      console.log('canceled')
    }, 500)
  }

  //* manage the user response
  const isActionConfirmed = async (bool: boolean) => {
    if (!bool) return handleCancel()
    onStartActions()
    await handleAccept()
    onFinishAction()
  }

  const [progress, setProgress] = useState(0)

  return (
    <div>
      <button
        className={`${openButtonClassName}`}
        onClick={(e) => {
          //* this is should be comment because some times works as submit button
          //e.preventDefault()
          //* you can disable to open the modal from the origin
          canOpen && handleOpen()
        }}
      >
        {btnLabel}{' '}
        {openIcon && (
          <span className="ml-2">
            <Icon name={openIcon} />
          </span>
        )}
      </button>
      <Modal open={open} handleOpen={handleOpen} title={modalTitle}>
        <div>
          <div>{children}</div>
          {!hiddenButtons && (
            <div className="flex w-full justify-around ">
              <button
                disabled={progress > 0}
                onClick={(e) => {
                  e.preventDefault()
                  isActionConfirmed(false)
                }}
                className="btn btn-error btn-outline"
              >
                Cancelar <Icon name="close" />
              </button>
              <button
                disabled={progress > 0}
                onClick={(e) => {
                  e.preventDefault()
                  isActionConfirmed(true)
                }}
                className="btn btn-info btn-outline"
              >
                Guardar {progress > 0 ? <Loading /> : <Icon name="save" />}
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default AsyncModal
