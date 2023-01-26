import Icon from 'components/Icon'
import { ReactNode, useState } from 'react'
import Modal from '..'
type StatusModalDelete = 'DELETE' | 'LOADING' | 'ERROR' | 'DELETED'
export interface OpenButtonProps {
  'data-test-id'?: string
  className?: string
}
interface ModalDeleteType {
  title: string
  handleDelete: () => Promise<any> | void
  openButtonProps?: OpenButtonProps
  buttonLabel?: string | null
  openModalItem?: (props: any) => ReactNode | null
  text?: string
  children?: ReactNode
  smallIcon?: boolean
}

const ModalDelete = ({
  title,
  handleDelete,
  openButtonProps,
  openModalItem,
  buttonLabel = 'Delete',
  text = 'Delete element',
  children,
  smallIcon
}: ModalDeleteType) => {
  const [status, setStatus] = useState<StatusModalDelete>('DELETE')
  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(!open)
  }

  const LABELS: Record<StatusModalDelete, string> = {
    DELETE: 'Delete',
    LOADING: 'Deleting',
    ERROR: 'Error',
    DELETED: 'Deleted successfully'
  }
  return (
    <>
      {openModalItem?.({
        onClick: (e: any) => {
          e.preventDefault()
          handleOpen()
        }
      }) || (
        <button
          onClick={(e) => {
            e.preventDefault()
            handleOpen()
          }}
          {...openButtonProps}
          className={` ${smallIcon && 'btn btn-circle btn-xs'} ${
            openButtonProps?.className ??
            ' flex justify-evenly btn btn-outline border-error  text-error'
          }`}
        >
          <span className="">
            <Icon name="delete" size={smallIcon ? 'xs' : 'md'} />{' '}
          </span>
          {(!smallIcon && buttonLabel) ?? <span>{buttonLabel}</span>}
        </button>
      )}
      <Modal title={title} open={open} handleOpen={handleOpen}>
        <div>
          <p className="text-center my-10">{text}</p>
          {children ? <div>{children}</div> : ''}
          <div className="flex w-full my-5 justify-evenly">
            <button
              disabled={['LOADING', 'ERROR'].includes(status)}
              className="btn btn-outline"
              onClick={(e) => {
                e.preventDefault()
                setOpen(false)
              }}
            >
              Cancel
            </button>
            <button
              disabled={['LOADING', 'ERROR', 'DELETED'].includes(status)}
              data-test-id="delete-modal-delete-button"
              className="btn btn-error"
              onClick={(e) => {
                e.preventDefault()
                setStatus('LOADING')

                handleDelete()
                  ?.then((res) => {
                    setStatus('DELETED')
                    setTimeout(() => {
                      setStatus('DELETE')
                    }, 2000)
                  })
                  .catch((err) => setStatus('ERROR'))
              }}
            >
              {LABELS[status]}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ModalDelete
