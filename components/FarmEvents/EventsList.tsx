import { useEffect, useState } from 'react'
import { AnimalFormattedWhitGenericEvenData } from 'types/base/AnimalType.model'
import FarmEventCard from './FarmEvent/FarmEventCard'

export const EventsList = ({
  events
}: {
  events: AnimalFormattedWhitGenericEvenData[]
}) => {
  const options = getEventTypesOptions(events)
  const [filteredEvents, setFilteredEvents] = useState(events)
  const [filterBy, setFilterBy] = useState('')
  useEffect(() => {
    if (!filterBy) {
      setFilteredEvents(events)
    } else {
      const filtered = events.filter(({ type }) => type === filterBy)
      setFilteredEvents(filtered)
    }
  }, [events, filterBy])

  return (
    <div role="events-list">
      <div>Filters</div>
      <FilterOptions
        label="Por tipo:"
        options={options}
        setOption={(value) => setFilterBy(value)}
      />
      {filteredEvents.map((event) => (
        <div key={event?.id} className="my-2">
          <FarmEventCard event={event} />
        </div>
      ))}
    </div>
  )
}

const FilterOptions = ({
  label,
  options,
  setOption
}: {
  label: string
  options: { label: string; value: string }[]
  setOption: (value: string) => void
}) => {
  return (
    <div className="form-control">
      <label htmlFor="filter" className="label">
        <span className="text-label">{label}</span>
      </label>
      <select
        onChange={({ target: { value } }) => setOption(value)}
        id="filter"
        className="input input-sm w-min input-bordered"
      >
        <option value={''}>Todos </option>
        {options?.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}

const getEventTypesOptions = (
  events: AnimalFormattedWhitGenericEvenData[]
): { label: string; value: string }[] => {
  const dictionary: Record<AnimalFormattedWhitGenericEvenData['type'], string> =
    {
      BREEDING: 'Monta',
      REMOVE: 'Eliminado',
      BIRTH: 'Parto',
      ABORT: 'Aborto',
      EMPTY: 'Vacio'
    }

  return events.reduce((prev, curr) => {
    const notExist = prev.find((option) => option.value === curr?.type)
    if (notExist) return prev
    return [...prev, { label: dictionary[curr.type], value: curr.type }]
  }, [])
  return []
}
