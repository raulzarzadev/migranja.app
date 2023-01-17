import useSortByField from '@comps/hooks/useSortByField'
import DebouncedInput from 'components/inputs/DebouncedInput'
import { useEffect, useState } from 'react'
import { FarmState, FarmStateAnimalEvent } from 'store/slices/farmSlice'
import { AnimalWeaning } from 'types/base/AnimalWeaning.model'
import {
  animalCurrentStatusLabels,
  AnimalCurrentStatusType
} from 'types/base/LABELS_TYPES/AnimalCurrentStatus'
import { labelsOfFarmEventTypes } from 'types/base/LABELS_TYPES/EventTypes'
import FarmEventCard from './FarmEvent/FarmEventCard'

export const EventsList = ({ events }: { events: FarmState['events'] }) => {
  const [filteredEvents, setFilteredEvents] = useState(events || [])
  const [filterBy, setFilterBy] = useState<string>('')
  const { arraySorted, handleSortBy } = useSortByField(events)

  useEffect(() => {
    if (!filterBy) {
      setFilteredEvents([...arraySorted])
    } else {
      const filtered = [...arraySorted].filter((event) => {
        return (
          animalCurrentStatusLabels[event?.type as AnimalCurrentStatusType]
            ?.toLowerCase()
            ?.includes(filterBy?.toLowerCase()) ||
          event?.eventData.breedingBatch?.find(({ earring }: any) =>
            earring?.includes(filterBy)
          ) ||
          event?.eventData.calfs?.find(({ earring }: any) =>
            earring?.includes(filterBy)
          ) ||
          event?.eventData?.parents?.father?.earring?.includes(filterBy) ||
          event?.eventData?.parents?.mother?.earring?.includes(filterBy)
        )
      })
      setFilteredEvents(filtered)
    }
  }, [arraySorted, events, filterBy])

  //console.log({ arraySorted })

  // const sortByLastUpdated = (a: any, b: any) => b.updatedAt - a.updatedAt
  return (
    <div role="events-list">
      <DebouncedInput
        onChange={(value) => setFilterBy(`${value}`)}
        value={filterBy}
        className="input input-bordered w-full placeholder:font-bold mb-2 "
        placeholder="Buscar ... "
      />
      <span>Total: {events.length}</span>
      <div className="flex w-full justify-around my-4">
        <button
          className="btn btn-outline btn-sm "
          onClick={(e) => {
            e.preventDefault()
            handleSortBy('eventData.date')
          }}
        >
          Por fecha
        </button>
        <button
          className="btn btn-outline btn-sm "
          onClick={(e) => {
            e.preventDefault()
            handleSortBy('updatedAt')
          }}
        >
          actualizado
        </button>
      </div>
      <div className="event-list overflow-auto shadow-inner">
        {[...filteredEvents].map((event) => (
          <div key={event?.id} className="my-2">
            <FarmEventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  )
}
