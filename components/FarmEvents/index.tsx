import { useSelector } from 'react-redux'
import { selectFarmEvents } from 'store/slices/farmSlice'
import { EventsList } from './EventsList'

const FarmEvents = () => {
  const events = useSelector(selectFarmEvents)
  console.log(events.filter((event) => event.type === 'WEANING'))
  return (
    <div className="w-full">
      <EventsList events={events} />{' '}
    </div>
  )
}

export default FarmEvents
