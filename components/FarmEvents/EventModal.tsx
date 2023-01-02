import { deleteEvent } from '@firebase/Events/main'
import Icon from 'components/Icon'
import Modal from 'components/modal'
import ModalDelete from 'components/modal/ModalDelete'
import { useState } from 'react'
import { myFormatDate } from 'utils/dates/myDateUtils'
import { FarmEventType } from './FarmEvent'

export const EventModal = ({ event }: { event: FarmEventType }) => {
  const [openEventDetails, setOpenEventDetails] = useState(false)
  const handleOpenEventDetails = () => {
    setOpenEventDetails(!openEventDetails)
  }
  const handleDeleteEvent = async () => {
    await deleteEvent(event.id)
      .then((res) => {
        console.log(res)
        return res
      })
      .catch((err) => console.log(err))
  }

  const birthData = event?.birthData
  return (
    <div role="details-modal">
      <div>
        <button onClick={(e) => handleOpenEventDetails()}>
          <Icon name="settings" />
        </button>
      </div>
      <Modal
        open={openEventDetails}
        handleOpen={handleOpenEventDetails}
        title="Detalles del Evento"
      >
        <div className="flex w-full justify-center flex-col items-center">
          <div>Tipo: {event?.type}</div>
          <div>
            {event.type === 'BIRTH' && birthData && (
              <div>
                <div>Nacimiento</div>
                Fecha:
                {event?.birthData?.date &&
                  myFormatDate(event?.birthData?.date, 'dd MMM yy')}
                <div>Crías:{birthData.calfs.length}</div>
                {birthData?.calfs?.map((calf) => (
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
