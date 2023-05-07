import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import { AnimalFormattedWhitGenericEvenData } from 'types/base/AnimalType.model'
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'
import EventModal from '../EventModal'
import { detailsOptions } from './FarmEvent'

export const FarmEventCard = ({
  event
}: {
  event: AnimalFormattedWhitGenericEvenData
}) => {
  const Options = detailsOptions({ event })
  return (
    <div className="bg-base-300 rounded-md pb-2 shadow-md ">
      <div className="text-end">
        <EventModal event={event} />
      </div>
      <div className="collapse">
        <input type={'checkbox'} />
        <div className="collapse-title pt-0 pb-0">
          <HeaderEventCard event={event} options={{ label: Options.label }} />
        </div>
        <div className="bg-base-200 collapse-content">
          <div className="p-2  ">{Options?.Component}</div>
        </div>
      </div>
    </div>
  )
}

const HeaderEventCard = ({
  event,
  options
}: {
  event: AnimalFormattedWhitGenericEvenData
  options: { label: string }
}) => {
  const eventDate = event?.eventData?.date
  return (
    <div role={'farm-event'} className={`bg-base-300 w-full rounded-md `}>
      <div className="flex justify-between items-center px-2 w-full ">
        <span>{options.label}</span>
        <span>{eventDate && myFormatDate(eventDate, 'dd MMM yy')}</span>
      </div>
      <header className="p-2 w-full flex justify-between items-center ">
        <div className="flex flex-col ">
          <span className="italic text-xs">
            Actualizado:{' '}
            {event.updatedAt && fromNow(event.updatedAt, { addSuffix: true })}
          </span>
        </div>
      </header>
    </div>
  )
}

export default FarmEventCard
