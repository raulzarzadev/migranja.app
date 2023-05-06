import IconBreedingStatus from '@comps/IconBreedingStatus'
import IconStatus from '@comps/IconStatus'
import TableDate from '@comps/MyTable/TableDate'
import WeaningIconStatus from '@comps/WeaningIconStatus'
import useAnimal from '@comps/hooks/useAnimal'
import useEvent from '@comps/hooks/useEvent'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import ModalDelete from '@comps/modal/ModalDelete'
import ModalEditWeaning from '@comps/modal/ModalEditWeaning'
import { AnimalWeaningType } from 'types/base/AnimalWeaning.model'
import {
  StatusOfFarmEvent,
  labelsOfFarmEventTypes
} from 'types/base/LABELS_TYPES/EventTypes'

const WeaningDetails = ({ weaningId }: { weaningId: string }) => {
  const { event } = useEvent({ eventId: weaningId })
  const eventStatus = event?.eventData?.status as StatusOfFarmEvent
  const { findParents } = useAnimal()
  const mother = findParents({
    animalEarring: event?.eventData.earring
  })?.mother
  return (
    <div className="text-center">
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
          {labelsOfFarmEventTypes[eventStatus]}{' '}
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
