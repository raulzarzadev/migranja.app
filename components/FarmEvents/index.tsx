import useFarm from 'components/hooks/useFarm'
import FarmEvent from './FarmEvent'

const FarmEvents = () => {
  const { farmEvents: events } = useFarm()
  return (
    <div className="w-full">
      <EventsList events={events} />
    </div>
  )
}
export const EventsList = ({ events }) => {
  return (
    <div role="events-list">
      {events.map((event) => (
        <div key={event?.id} className="my-2">
          <FarmEvent event={event} />
        </div>
      ))}
    </div>
  )
}

export default FarmEvents
