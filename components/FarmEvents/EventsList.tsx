import DebouncedInput from 'components/inputs/DebouncedInput'
import { useEffect, useState } from 'react'
import { FarmState, FarmStateAnimalEvent } from 'store/slices/farmSlice'
import { AnimalFormattedWhitGenericEvenData } from 'types/base/AnimalType.model'
import { AnimalWeaning } from 'types/base/AnimalWeaning.model'
import { FarmEventDropOut } from 'types/base/FarmEventDropOut.model'
import { labelsOfFarmEventTypes } from 'types/base/LABELS_TYPES/EventTypes'
import FarmEventCard from './FarmEvent/FarmEventCard'

export const EventsList = ({ events }: { events: FarmState['events'] }) => {
  const [filteredEvents, setFilteredEvents] = useState(events || [])
  const [filterBy, setFilterBy] = useState<string>('')
  useEffect(() => {
    if (!filterBy) {
      setFilteredEvents(events)
    } else {
      const filtered = events.filter((event) => {
        const dictionary: Record<
          FarmStateAnimalEvent['type'] | AnimalWeaning['type'],
          string
        > = {
          BREEDING: 'Monta',
          REMOVE: 'Removida',
          BIRTH: 'Parto',
          ABORT: 'Aborto',
          EMPTY: 'Vacio',
          DROP_OUT: 'Baja',
          DROP_IN: 'Alta',
          WEANING: 'Destete'
        }
        return (
          dictionary[event?.type]
            .toLowerCase()
            .includes(filterBy.toLowerCase()) ||
          event?.eventData.breedingBatch?.find(({ earring }) =>
            earring?.includes(filterBy)
          ) ||
          event?.eventData.calfs?.find(({ earring }) =>
            earring?.includes(filterBy)
          ) ||
          event?.eventData?.parents?.father?.earring?.includes(filterBy) ||
          event?.eventData?.parents?.mother?.earring?.includes(filterBy)
        )
      })
      setFilteredEvents(filtered)
    }
  }, [events, filterBy])

  const sortByLastUpdated = (a: any, b: any) => b.updatedAt - a.updatedAt
  return (
    <div role="events-list">
      <DebouncedInput
        onChange={(value) => setFilterBy(`${value}`)}
        value={filterBy}
        className="input input-bordered w-full placeholder:font-bold mb-2 "
        placeholder="Buscar ..."
      />
      <div className="event-list overflow-auto shadow-inner">
        {[...filteredEvents].sort(sortByLastUpdated).map((event) => (
          <div key={event?.id} className="my-2">
            <FarmEventCard event={event} />
          </div>
        ))}
      </div>
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
  const dictionary = labelsOfFarmEventTypes

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
