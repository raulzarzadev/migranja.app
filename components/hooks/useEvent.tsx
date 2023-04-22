import { EventType } from '@firebase/Events/event.model'
import { useSelector } from 'react-redux'
import { selectFarmEvents } from 'store/slices/farmSlice'

const useEvent = ({ eventId }: { eventId?: EventType['id'] }) => {
  const event = useSelector(selectFarmEvents).find(({ id }) => id === eventId)
  if (!eventId) return { event: null }
  return { event }
}

export default useEvent
