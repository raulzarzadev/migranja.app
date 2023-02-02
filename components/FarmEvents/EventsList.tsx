import EventsFilters from '@comps/EventsFilters'
import useSortByField from '@comps/hooks/useSortByField'
import HeaderTable from '@comps/MyTables/HeaderTable'
import { useState } from 'react'
import { FarmState } from 'store/slices/farmSlice'

import FarmEventCard from './FarmEvent/FarmEventCard'

export const EventsList = ({ events }: { events: FarmState['events'] }) => {
  const [filteredEvents, setFilteredEvents] = useState(events || [])
  //const [filterBy, setFilterBy] = useState<string>('')

  // useEffect(() => {
  //   if (!filterBy) {
  //     setFilteredEvents([...events])
  //   } else {
  //     const filtered = [...events].filter((event) => {
  //       return (
  //         animalCurrentStatusLabels[event?.type as AnimalCurrentStatusType]
  //           ?.toLowerCase()
  //           ?.includes(filterBy?.toLowerCase()) ||
  //         event?.eventData?.breedingBatch?.find(({ earring }: any) =>
  //           earring?.includes(filterBy)
  //         ) ||
  //         event?.eventData.calfs?.find(({ earring }: any) =>
  //           earring?.includes(filterBy)
  //         ) ||
  //         event?.eventData?.parents?.father?.earring?.includes(filterBy) ||
  //         event?.eventData?.parents?.mother?.earring?.includes(filterBy) ||
  //         event?.eventData?.earring?.includes(filterBy)
  //       )
  //     })
  //     setFilteredEvents(filtered)
  //   }
  // }, [events, filterBy])

  const { arraySorted, ...sortMethods } = useSortByField(filteredEvents, {
    defaultSortField: 'createdAt',
    reverse: false
  })

  return (
    <div role="events-list">
      {/* <DebouncedInput
        onChange={(value) => setFilterBy(`${value}`)}
        value={''}
        className="input input-bordered w-full placeholder:font-bold mb-2 "
        placeholder="Buscar ... "
      /> */}
      <EventsFilters array={events} setArray={setFilteredEvents} />
      <div className="text-center">
        <span>
          Coincidencias {filteredEvents?.length || 0} de {events?.length}
        </span>
      </div>
      <div className="flex w-full justify-around my-4 flex-col sm:flex-row gap-2 ">
        <HeaderTable
          label={'Tipo de evento'}
          fieldName={'type'}
          {...sortMethods}
        />
        <HeaderTable
          label={'Creado'}
          fieldName={'updatedAt'}
          {...sortMethods}
        />
        <HeaderTable
          label={'Programado'}
          fieldName={'eventData.date'}
          {...sortMethods}
        />
      </div>

      <div className="event-list overflow-auto shadow-inner">
        {[...arraySorted].map((event, i) => (
          <div key={`${event?.id}-${i}`} className="my-2">
            <FarmEventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  )
}
