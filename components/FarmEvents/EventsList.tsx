import useSortByField from '@comps/hooks/useSortByField'
import DebouncedInput from 'components/inputs/DebouncedInput'
import { useEffect, useState } from 'react'
import { FarmState } from 'store/slices/farmSlice'
import {
  animalCurrentStatusLabels,
  AnimalCurrentStatusType
} from 'types/base/LABELS_TYPES/AnimalCurrentStatus'
import FarmEventCard from './FarmEvent/FarmEventCard'

export const EventsList = ({ events }: { events: FarmState['events'] }) => {
  const [filteredEvents, setFilteredEvents] = useState(events || [])
  const [filterBy, setFilterBy] = useState<string>('')

  useEffect(() => {
    if (!filterBy) {
      setFilteredEvents([...events])
    } else {
      const filtered = [...events].filter((event) => {
        return (
          animalCurrentStatusLabels[event?.type as AnimalCurrentStatusType]
            ?.toLowerCase()
            ?.includes(filterBy?.toLowerCase()) ||
          event?.eventData?.breedingBatch?.find(({ earring }: any) =>
            earring?.includes(filterBy)
          ) ||
          event?.eventData.calfs?.find(({ earring }: any) =>
            earring?.includes(filterBy)
          ) ||
          event?.eventData?.parents?.father?.earring?.includes(filterBy) ||
          event?.eventData?.parents?.mother?.earring?.includes(filterBy) ||
          event?.eventData?.earring?.includes(filterBy)
        )
      })
      setFilteredEvents(filtered)
    }
  }, [events, filterBy])

  const { arraySorted } = useSortByField(filteredEvents, {
    defaultSortField: 'createdAt',
    reverse: false
  })

  return (
    <div role="events-list">
      <DebouncedInput
        onChange={(value) => setFilterBy(`${value}`)}
        value={''}
        className="input input-bordered w-full placeholder:font-bold mb-2 "
        placeholder="Buscar ... "
      />
      <div className="text-center">
        <span>
          Coincidencias {filteredEvents.length || 0} de {events.length}
        </span>
      </div>
      {/* <div className="flex w-full justify-around my-4">
        <button
          className="btn btn-outline btn-sm "
          onClick={(e) => {
            e.preventDefault()
            // handleSortBy('eventData.date')
          }}
        >
          Por fecha
        </button>
        <button
          className="btn btn-outline btn-sm "
          onClick={(e) => {
            e.preventDefault()
            //handleSortBy('updatedAt')
          }}
        >
          actualizado
        </button>
      </div> */}
      <div className="event-list overflow-auto shadow-inner">
        {[...arraySorted].map((event) => (
          <div key={event?.id} className="my-2">
            <FarmEventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  )
}
