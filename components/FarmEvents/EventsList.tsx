import useSortByField from 'components/hooks/useSortByField'
import { useEffect, useState } from 'react'
import { FarmState } from 'store/slices/farmSlice'
import { AnimalFormattedWhitGenericEvenData } from 'types/base/AnimalType.model'
import { FarmEventDropOut } from 'types/base/FarmEventDropOut.model'
import FarmEventCard from './FarmEvent/FarmEventCard'

export const EventsList = ({ events }: { events: FarmState['events'] }) => {
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

  const { handleSortBy, arraySorted, reverse } = useSortByField(filteredEvents)

  return (
    <div role="events-list">
      <div>Filters</div>
      <FilterOptions
        label="Por tipo:"
        options={options}
        setOption={(value) => setFilterBy(value)}
      />
      <SortedOptions
        sortBy={handleSortBy}
        options={[
          { label: 'Ultimo actualizado', value: 'updatedAt' },
          { label: 'Fecha', value: 'eventData.date' }
        ]}
      />
      {arraySorted.map((event) => (
        <div key={event?.id} className="my-2">
          <FarmEventCard event={event} />
        </div>
      ))}
    </div>
  )
}

const SortedOptions = ({
  options,
  sortBy
}: {
  options: { value: string; label: string }[]
  sortBy: (val: string) => void
}) => {
  return (
    <div className="flex w-full justify-center">
      {options?.map((option) => (
        <button
          key={option.value}
          className={`btn btn-outline btn-sm`}
          onClick={() => sortBy(option.value)}
        >
          {option.label}
        </button>
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

interface SelectOption {
  label: string
  value: string
}

const getEventTypesOptions = (events: FarmState['events']): SelectOption[] => {
  const dictionary: Record<
    AnimalFormattedWhitGenericEvenData['type'] | FarmEventDropOut['type'],
    string
  > = {
    BREEDING: 'Monta',
    REMOVE: 'Eliminado',
    BIRTH: 'Parto',
    ABORT: 'Aborto',
    EMPTY: 'Vacio',
    DROP_OUT: 'Baja',
    DROP_IN: 'Alta'
  }

  const options: SelectOption[] = events.reduce(
    (prev: SelectOption[], curr) => {
      const notExist = prev.find((option) => option.value === curr?.type)
      if (notExist) return prev
      return [...prev, { label: dictionary[curr.type], value: curr.type }]
    },
    []
  )
  return options
}
