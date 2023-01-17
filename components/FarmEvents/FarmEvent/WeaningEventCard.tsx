import LinkFarmAnimal from '@comps/Buttons&Links/LinkFarmAnimal'
import { AnimalWeaningType } from 'types/base/AnimalWeaning.model'
import { myFormatDate } from 'utils/dates/myDateUtils'
import ModalEditWeaning from '@comps/modal/ModalEditWeaning'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'

export const WEANING_STATUS_LABELS: Record<
  AnimalWeaningType['eventData']['status'],
  string
> = {
  DONE: 'Hecho',
  PENDING: 'Pendiente',
  CANCELLED: 'Cancelado'
}
const WeaningEventCard = ({ event }: { event: Partial<AnimalWeaningType> }) => {
  return (
    <div>
      <div className="grid grid-cols-3">
        <div>Arete</div>
        <div>Fecha</div>
        <div>Status</div>
      </div>
      <div className="grid grid-cols-3">
        <div>
          <ModalAnimalDetails earring={event.eventData?.earring || ''} />
        </div>
        <div>
          {event.eventData?.date &&
            myFormatDate(event.eventData?.date, 'dd MMM yy')}
        </div>
        <div className="flex items-center">
          <span>
            {WEANING_STATUS_LABELS[event?.eventData?.status || 'PENDING']}
          </span>
          <div className="ml-4">
            <ModalEditWeaning eventId={event.id || ''} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeaningEventCard
