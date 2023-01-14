import Icon from '@comps/Icon'
import { updateEvent } from '@firebase/Events/main'
import { useState } from 'react'
import Modal from '..'

const ModalEditWeaning = ({ eventId }: { eventId: string }) => {
  const [openEditEvent, setOpenEditEvent] = useState(false)
  const handleOpenEditEvent = () => {
    setOpenEditEvent(!openEditEvent)
  }
  return (
    <>
      <button
        className="text-info"
        onClick={(e) => {
          e.preventDefault()
          handleOpenEditEvent()
        }}
      >
        <Icon name="edit" />
      </button>
      <Modal
        open={openEditEvent}
        handleOpen={handleOpenEditEvent}
        title="Edit event"
      >
        <div className="flex flex-col w-full justify-center items-center my-5">
          <p>Marcar como hecho.</p>
          <button
            className="btn btn-info mt-5 "
            onClick={(e) => {
              e.preventDefault()
              // @ts-ignore
              updateEvent(eventId, { 'eventData.status': 'DONE' })
            }}
          >
            Hecho
          </button>
        </div>
      </Modal>
    </>
  )
}

export default ModalEditWeaning
