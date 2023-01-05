import { AnimalFormattedWhitGenericEvenData } from 'types/base/AnimalType.model'
import FarmEventCard from './FarmEvent/FarmEventCard'

export const EventsList = ({
  events
}: {
  events: AnimalFormattedWhitGenericEvenData[]
}) => {
  console.log(events)
  return (
    <div role="events-list">
      {events.map((event) => (
        <div key={event?.id} className="my-2">
          <FarmEventCard event={event} />
        </div>
      ))}
    </div>
  )
}
