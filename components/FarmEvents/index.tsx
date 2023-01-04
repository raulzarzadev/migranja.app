import { useSelector } from 'react-redux'
import { selectFarmEvents } from 'store/slices/farmSlice'

const FarmEvents = () => {
  const events = useSelector(selectFarmEvents)

  return (
    <div className="w-full">
      <EventsList events={events} />{' '}
    </div>
  )
}

export const EventsList = ({ events }: { events }) => {
  return (
    <div role="events-list">
      {/* {eventsFormatted.map((event) => (
        <div key={event?.id} className="my-2">
          <FarmEvent event={event} />
        </div>
      ))} */}
    </div>
  )
}

export default FarmEvents
