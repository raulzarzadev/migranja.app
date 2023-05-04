import { useSelector } from 'react-redux'
import { selectFarmEvents } from 'store/slices/farmSlice'

const useEvents = () => {
  const events = useSelector(selectFarmEvents)
  const findEvent = ({ eventId }: { eventId?: string }) =>
    events.find((e) => e.id === eventId)
  return { events, findEvent }
}

export default useEvents
