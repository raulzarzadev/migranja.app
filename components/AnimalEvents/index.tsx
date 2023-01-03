import { EventType } from '@firebase/Events/event.model'
import { EventsList } from 'components/FarmEvents'
import { FarmEventType } from 'components/FarmEvents/FarmEvent'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmEvents } from 'store/slices/farmSlice'

const AnimalEvents = ({ animalEarring }: { animalEarring: string }) => {
  const [events, setEvents] = useState<EventType[]>([])
  const farmEvents = useSelector(selectFarmEvents)

  useEffect(() => {
    const birth = farmEvents.filter((event) =>
      event?.birthData?.calfs?.find((calf) => calf?.earring === animalEarring)
    )
    const breeding = farmEvents.filter((event) => {
      const asMale = event?.breedingMale?.earring === animalEarring
      const asFemale = event?.breedingBatch?.find(
        ({ earring }) => earring === animalEarring
      )
      return asMale || asFemale
    })

    const aborts = farmEvents.filter(
      (event) =>
        event?.type === 'ABORT' &&
        event?.parents?.mother?.earring === animalEarring
    )
    const empty = farmEvents.filter(
      (event) =>
        event?.type === 'EMPTY' &&
        event?.parents?.mother?.earring === animalEarring
    )
    setEvents([...birth, ...breeding, ...aborts, ...empty])
  }, [animalEarring, farmEvents])

  return <EventsList events={events as FarmEventType[]} />
}

export default AnimalEvents
