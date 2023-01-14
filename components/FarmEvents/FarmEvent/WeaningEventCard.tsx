import LinkFarmAnimal from '@comps/Buttons&Links/LinkFarmAnimal'
import { AnimalWeaningType } from 'types/base/AnimalWeaning.model'
import { myFormatDate } from 'utils/dates/myDateUtils'
import ModalEditWeaning from '@comps/modal/ModalEditWeaning'

const WeaningEventCard = ({ event }: { event: Partial<AnimalWeaningType> }) => {
  const label: Record<AnimalWeaningType['eventData']['status'], string> = {
    DONE: 'Hecho',
    PENDING: 'Pendiente'
  }

  return (
    <div>
      <div className="grid grid-cols-3">
        <div>Arete</div>
        <div>Fecha</div>
        <div>Status</div>
      </div>
      <div className="grid grid-cols-3">
        <div>
          {event.eventData?.earring}{' '}
          <LinkFarmAnimal animalEarringOrId={event.eventData?.earring} />
        </div>
        <div>
          {event.eventData?.date &&
            myFormatDate(event.eventData?.date, 'dd MMM yy')}
        </div>
        <div className="flex items-center">
          <span>
            {
              label[
                event?.eventData
                  ?.status as AnimalWeaningType['eventData']['status']
              ]
            }
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
