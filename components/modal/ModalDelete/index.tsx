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
  handleDelete: () => void
  openButtonProps?: OpenButtonProps
  buttonLabel: string | null
  openModalItem?: (props: any) => ReactNode | null
}

const ModalDelete = ({
  title,
  handleDelete,
  openButtonProps,
  openModalItem,
  buttonLabel = 'Delete'
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
          className={` ${
            openButtonProps?.className ??
            ' flex justify-evenly btn btn-outline border-error  text-error'
          }`}
        >
          <span className="">
            <Icon name="delete" />{' '}
          </span>
          {buttonLabel ?? <span>{buttonLabel}</span>}
        </button>
      )}
      <Modal title={title} open={open} handleOpen={handleOpen}>
        <div>
          <p className="text-center my-10">Delete element</p>
          <div className="flex w-full my-5 justify-evenly">
            <button
              className="btn btn-outline"
              onClick={(e) => {
                e.preventDefault()
                setOpen(false)
              }}
            >
              Cancel
            </button>
            <button
              data-test-id="delete-modal-delete-button"
              className="btn btn-error"
              onClick={(e) => {
                e.preventDefault()
                setStatus('LOADING')

                handleDelete()

                setTimeout(() => {
                  setStatus('DELETED')
                }, 300)
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
