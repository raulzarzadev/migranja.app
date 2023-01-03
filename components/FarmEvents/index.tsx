import useDebugInformation from 'components/hooks/useDebugInformation'
import useFarm from 'components/hooks/useFarm'
import { useSelector } from 'react-redux'
import { selectFarmEvents } from 'store/slices/farmSlice'
import FarmEvent, { FarmEventType } from './FarmEvent'

const FarmEvents = () => {
  // const { farmEvents: events } = useFarm()
  const events = useSelector(selectFarmEvents)
  // useDebugInformation('FarmEvents', {})
  // console.log({ events: [{}] })
  return (
    <div className="w-full">
      <EventsList events={events as FarmEventType[]} />
    </div>
  )
}

export const EventsList = ({ events }: { events: FarmEventType[] }) => {
  // console.log(events)
  console.log(events)
  return (
    <div role="events-list">
      {/* {events.map((event) => (
        <div key={event?.id} className="my-2">
          <FarmEvent event={event} />
        </div>
      ))} */}
    </div>
  )
}

export default FarmEvents
