import H2 from '@comps/Basics/Title2'
import { WEANING_STATUS_LABELS } from '@comps/FarmEvents/FarmEvent/WeaningEventCard'
import { IconStatus } from '@comps/IconBreedingStatus'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import ModalEditWeaning from '@comps/modal/ModalEditWeaning'
import { EventStatus } from 'types/base/LABELS_TYPES/EventTypes'
import { myFormatDate } from 'utils/dates/myDateUtils'
import { defineStatusByDate } from 'utils/defineStatusByDate'

const WeaningByEarring = ({ weaning }: { weaning: any[] }) => {
  return (
    <div className="">
      <table className="table w-full table-compact">
        <thead>
          <tr>
            <th>Arete</th>
            <th>Fecha</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="">
          {weaning.map((event) => (
            <tr key={event.id} className="bg-base-300 rounded-md my-2 p-1 px-2">
              <td>
                <ModalAnimalDetails
                  earring={event.eventData.earring}
                  size="sm"
                />
              </td>
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
                <span>
                  {
                    WEANING_STATUS_LABELS[
                      event?.eventData?.status as EventStatus
                    ]
                  }
                </span>
                <ModalEditWeaning
                  eventId={event.id || ''}
                  animalEarring={event.eventData.earring}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default WeaningByEarring
