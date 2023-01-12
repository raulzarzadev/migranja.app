import { deleteEvent } from '@firebase/Events/main'
import Icon from 'components/Icon'
import Modal from 'components/modal'
import ModalDelete from 'components/modal/ModalDelete'
import { useState } from 'react'
import { FarmStateAnimalEvent } from 'store/slices/farmSlice'
import { myFormatDate } from 'utils/dates/myDateUtils'

export const EventModal = ({ event }: { event: FarmStateAnimalEvent }) => {
  const [openEventDetails, setOpenEventDetails] = useState(false)
  const handleOpenEventDetails = () => {
    setOpenEventDetails(!openEventDetails)
  }
  const handleDeleteEvent = async () => {
    event.id &&
      (await deleteEvent(event.id)
        .then((res) => {
          console.log(res)
          return res
        })
        .catch((err) => console.log(err)))
  }

  const eventData = event?.eventData
  return (
    <div role="details-modal">
      <div className="p-1 pb-0">
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleOpenEventDetails()
          }}
        >
          <Icon name="settings" />
        </button>
      </div>
      <Modal
        open={openEventDetails}
        handleOpen={handleOpenEventDetails}
        title="Detalles del Evento"
      >
        <div className="flex w-full justify-center flex-col items-center">
          <div>Tipo:{event?.type}</div>
          <div>
            {event.type === 'BIRTH' && eventData && (
              <div>
                <div>Nacimiento</div>
                Fecha:
                {eventData.date && myFormatDate(eventData.date, 'dd MMM yy')}
                <div>Crías:{eventData?.calfs?.length}</div>
                {eventData?.calfs?.map((calf) => (
                  <div key={calf?.earring}>{calf?.earring}</div>
                ))}
              </div>
            )}
          </div>

          <div>
            <ModalDelete
              title="Eliminar evento"
              buttonLabel={'Eliminar'}
              handleDelete={() => handleDeleteEvent()}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default EventModal
