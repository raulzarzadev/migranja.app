import { EventsList } from '@comps/FarmEvents/EventsList'
import WeaningEventCard, {
  WEANING_STATUS_LABELS
} from '@comps/FarmEvents/FarmEvent/WeaningEventCard'
import { IconStatus } from '@comps/IconBreedingStatus'
import ModalEditWeaning from '@comps/modal/ModalEditWeaning'
import { subDays } from 'date-fns'
import { addDays } from 'date-fns/esm'
import { useSelector } from 'react-redux'
import { selectFarmEvents } from 'store/slices/farmSlice'
import { AnimalWeaningType } from 'types/base/AnimalWeaning.model'
import { animalCurrentStatusLabels } from 'types/base/LABELS_TYPES/AnimalCurrentStatus'
import { myFormatDate } from 'utils/dates/myDateUtils'
import { defineStatusByDate } from 'utils/defineStatusByDate'

const WeaningEvents = () => {
  const events = useSelector(selectFarmEvents)
  const weaning = events.filter((event) => event.type === 'WEANING')

  return (
    <div className="w-full p-2">
      <table className="table w-full table-compact">
        <thead>
          <tr>
            <th>Arete</th>
            <th>Fecha</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {weaning.map((event) => (
            <tr key={event.id} className="bg-base-300 rounded-md my-2 p-1 px-2">
              <td>{event?.eventData?.earring}</td>
              <td>{myFormatDate(event?.eventData?.date, 'dd MMM yy')}</td>

              <td>
                <span>
                  <IconStatus
                    status={
                      defineStatusByDate(event?.eventData?.date as number) ||
                      'info'
                    }
                  />{' '}
                </span>
                <span>{WEANING_STATUS_LABELS[event?.eventData?.status]}</span>
                <ModalEditWeaning eventId={event.id || ''} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default WeaningEvents
