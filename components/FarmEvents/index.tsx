import { useSelector } from 'react-redux'
import { selectFarmEvents } from 'store/slices/farmSlice'
import { EventsList } from './EventsList'

const FarmEvents = () => {
  const events = useSelector(selectFarmEvents)

  return (
    <div className="w-full bg-base-300  p-2 rounded-md">
      <h2 className="text-center font-bold text-xl">Todos los eventos</h2>
      <EventsList events={events} />{' '}
    </div>
  )
}

export default FarmEvents
