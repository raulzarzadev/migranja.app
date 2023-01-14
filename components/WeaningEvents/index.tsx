import { EventsList } from '@comps/FarmEvents/EventsList'
import { useSelector } from 'react-redux'
import { selectFarmEvents } from 'store/slices/farmSlice'

const WeaningEvents = () => {
  const events = useSelector(selectFarmEvents)
  const births = events.filter((event) => event.type === 'WEANING')
  return (
    <div className="w-full">
      <EventsList events={births} />
    </div>
  )
}

export default WeaningEvents
