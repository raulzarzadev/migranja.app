import { useEffect, useState } from 'react'

const AnimalEvents = () => {
  const [events, setEvents] = useState([])
  useEffect(() => {
    getEvents
  }, [])
  return (
    <div>
      <div>all events</div>
    </div>
  )
}

export default AnimalEvents
