import { WEANING_STATUS_LABELS } from '@comps/FarmEvents/FarmEvent/WeaningEventCard'
import Icon from '@comps/Icon'
import TableDate from '@comps/MyTable/TableDate'
import WeaningIconStatus from '@comps/WeaningIconStatus'
import useAnimal from '@comps/hooks/useAnimal'
import useEvent from '@comps/hooks/useEvent'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import ModalBirthDetails from '@comps/modal/ModalBirthDetails'
import ModalDelete from '@comps/modal/ModalDelete'
import ModalEditWeaning from '@comps/modal/ModalEditWeaning'
import { useSelector } from 'react-redux'
import { selectFarmEvents } from 'store/slices/farmSlice'
import { StatusOfFarmEvent } from 'types/base/LABELS_TYPES/EventTypes'

const WeaningDetails = ({ weaningId }: { weaningId: string }) => {
  const events = useSelector(selectFarmEvents)
  const { event } = useEvent({ eventId: weaningId })
  const eventStatus = event?.eventData?.status as StatusOfFarmEvent
  const { findParents } = useAnimal()
  const mother = findParents({
    animalEarring: event?.eventData.earring
  })?.mother

  const birthEvent = events.filter(
    (evt) =>
      evt.type === 'BIRTH' &&
      evt?.eventData.calfs?.find(
        (animal) => animal.earring === event?.eventData.earring
      )
  )?.[0]

  return (
    <div className="text-center">
      <div className="flex w-full justify-end ">
        <ModalBirthDetails birthId={birthEvent.id}>
          <button className="btn btn-ghost btn-sm">
            Parto
            <span className="ml-2">
              <Icon name="birth" size="xs" />
            </span>
          </button>
        </ModalBirthDetails>
      </div>
      <div className="flex justify-evenly w-full">
        <span>
          <span className="font-bold">Creado:</span>{' '}
          <TableDate date={event?.createdAt as number} />
        </span>
        <span>
          <span className="font-bold">Programado:</span>{' '}
          <TableDate date={event?.eventData.date as number} />
        </span>
      </div>
      <div className="flex w-full justify-evenly my-4">
        <div>
          <span className="font-bold">Cría:</span>
          <div>
            <ModalAnimalDetails
              earring={event?.eventData.earring}
              size="normal"
            />
          </div>
        </div>
        <div>
          <span className="font-bold">Madre:</span>
          <div>
            <ModalAnimalDetails earring={mother?.earring} size="normal" />
          </div>
        </div>
      </div>

      <div>
        <span className="font-bold">Status:</span>
        <div>
          {WEANING_STATUS_LABELS[eventStatus]}{' '}
          <WeaningIconStatus status={eventStatus} />
        </div>
      </div>
      <div className="flex w-full justify-center">
        <div className="flex w-full justify-evenly">
          <ModalDelete
            title="Eliminar evento"
            buttonLabel={'Eliminar'}
            handleDelete={() => {
              console.log('delete')
            }}
          />
          {event?.eventData.status === 'PENDING' && (
            <ModalEditWeaning
              eventId={event?.id}
              animalEarring={event?.eventData?.earring}
            />
          )}
          {event?.eventData.status === 'CANCELLED' && (
            <button className="btn btn-outline btn-error">Cancelado</button>
          )}
          {event?.eventData.status === 'DONE' && (
            <button className="btn btn-success">Completado</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default WeaningDetails
