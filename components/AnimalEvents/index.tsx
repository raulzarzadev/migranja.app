import { EventsList } from 'components/FarmEvents/EventsList'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FarmState, selectFarmEvents } from 'store/slices/farmSlice'

const AnimalEvents = ({ animalEarring }: { animalEarring: string }) => {
  const [events, setEvents] = useState<FarmState['events']>([])
  const farmEvents = useSelector(selectFarmEvents)

  useEffect(() => {
    const birth = farmEvents.filter((event) =>
      event.eventData?.calfs?.find(({ earring }) => earring === animalEarring)
    )

    const breeding = farmEvents.filter((event) => {
      const asMale = event?.eventData?.breedingMale?.earring === animalEarring
      const asFemale = event?.eventData?.breedingBatch?.find(
        ({ earring }) => earring === animalEarring
      )
      return asMale || asFemale
    })

    //  console.log({ farmEvents })

    const aborts = farmEvents.filter(
      (event) =>
        event?.type === 'ABORT' &&
        event?.eventData?.parents?.mother?.earring === animalEarring
    )

    const empty = farmEvents.filter(
      (event) =>
        event?.type === 'EMPTY' &&
        event?.eventData?.parents?.mother?.earring === animalEarring
    )

    const dropOut = farmEvents.filter(
      (event) =>
        event?.type === 'DROP_OUT' &&
        event?.eventData?.animals?.find(
          (animal: { earring: string }) => animal.earring === animalEarring
        )
    )

    const dropIn = farmEvents.filter(
      (event) =>
        event?.type === 'DROP_IN' &&
        event?.eventData?.animals?.find(
          (animal: { earring: string }) => animal.earring === animalEarring
        )
    )

    const births = farmEvents.filter(
      (event) => event?.eventData?.parents?.mother?.earring === animalEarring
    )

    const weanings = farmEvents.filter(
      (event) =>
        event?.type === 'WEANING' && event.eventData?.earring === animalEarring
    )

    setEvents([
      ...birth,
      ...breeding,
      ...aborts,
      ...empty,
      ...dropOut,
      ...births,
      ...dropIn,
      ...weanings
    ])
  }, [animalEarring, farmEvents])

  return <EventsList events={events} />
}

export default AnimalEvents
