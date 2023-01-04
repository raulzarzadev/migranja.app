import { BreedingEventType } from '@firebase/Events/event.model'
import { listenFarmBreedings } from '@firebase/Events/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import BreedingBatchesList, {
  BreedingBatchesListType
} from 'components/BreedingBatchesList'
import {
  BreedingDetailsEvent,
  GenericEventType
} from 'components/FarmEvents/FarmEvent/FarmEvent.model'
import useDebugInformation from 'components/hooks/useDebugInformation'
import useSortByField from 'components/hooks/useSortByField'
import Icon from 'components/Icon'
import DebouncedInput from 'components/inputs/DebouncedInput'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmEvents } from 'store/slices/farmSlice'
import AnimalBreedingCard from './AnimalBreedingCard'
import {
  BreedingFormatted,
  formatBreedingsGenericEvent
} from './breeding.helpers'

interface SearchField {
  value: string
  matches: AnimalType[]
}

const BreedingsList = () => {
  const farmEvents = useSelector(selectFarmEvents)
  const farmBreedingsEvents = farmEvents.filter(
    (event) => event.type === 'BREEDING'
  )
  const [search, setSearch] = useState<SearchField>({ value: '', matches: [] })
  const [view, setView] = useState<'breeding' | 'animals'>('breeding')

  const [animals, setAnimals] = useState<Partial<AnimalType>[]>([])
  const [animalsFiltered, setAnimalsFilter] = useState<Partial<AnimalType>[]>(
    []
  )
  const [batches, setBatches] = useState<
    GenericEventType<BreedingDetailsEvent>[]
  >([])
  const [batchesFiltered, setBreedingFilter] = useState([])

  useDebugInformation('BreedingsList', {})

  const filterField = (field: string = '', search: string = '') => {
    return field?.toLowerCase()?.includes(search?.toLowerCase())
  }

  useEffect(() => {
    const batchesFormatted = farmBreedingsEvents.map(
      ({
        eventData,
        farm,
        type,
        status,
        createdAt,
        id,
        updatedAt,
        userId
      }): GenericEventType<BreedingDetailsEvent> => {
        const formatted = {
          createdAt,
          eventData,
          farm,
          id,
          type,
          updatedAt,
          userId,
          status
        }
        return {
          ...formatted,
          eventData: { ...formatted.eventData, breedingId: 'juujuyhyujh' }
        }
        // const breedingBatchFormattedWithEventDetails =

        //   event.eventData.breedingBatch?.map((animal) => {
        //     return { ...animal, eventData: event }
        //   })
        // return {
        //   ...event,
        //   eventData: {
        //     ...event.eventData,
        //     breedingBatch: breedingBatchFormattedWithEventDetails
        //   }
        // }
      }
    )
    const animalsFormatted = batchesFormatted.map((batch) =>
      batch.eventData.breedingBatch?.map((animal) => animal)
    )
    const dates = formatBreedingsGenericEvent(batchesFormatted)

    setAnimals(animalsFormatted.flat())
    setBatches(batchesFormatted)
    console.log({ animals, batches, dates })
  }, [])

  useEffect(() => {
    const animalsFiltered = [...animals].filter(
      (animal) =>
        // filter  earrings
        filterField(animal?.earring, search.value) ||
        // filter  by bull
        filterField(animal?.breeding?.breedingMale?.earring, search.value) ||
        // filter  by batch
        filterField(animal?.batch || '', search.value)
    )

    const batchesFiltered = [...batches].filter((batch) =>
      // filter  by bull
      filterField(batch.eventData.breedingMale?.earring || '', search.value)
    )
    setAnimalsFilter(animalsFiltered)
    setBreedingFilter(batchesFiltered)
  }, [animals, batches, search.value])
  return <></>
  return (
    <div className="w-full">
      <div className="flex w-full items-center">
        <DebouncedInput
          value={search.value ?? ''}
          onChange={(value) => setSearch({ ...search, value: value as string })}
          className=" input input-sm w-full input-bordered"
          placeholder="Buscar..."
        />
        <div className="whitespace-nowrap ml-1">
          Encontrados{' '}
          {view === 'animals' ? animalsFiltered.length : batchesFiltered.length}
        </div>
      </div>
      <div className="flex justify-evenly w-full my-4">
        <button
          className={`btn btn-sm btn-outline ${
            view == 'breeding' ? 'btn-active' : ''
          }`}
          onClick={() => setView('breeding')}
        >
          Por Montas
        </button>
        <button
          className={`btn btn-sm btn-outline ${
            view == 'animals' ? 'btn-active' : ''
          }`}
          onClick={() => setView('animals')}
        >
          Por Animales
        </button>
      </div>
      <BreedingBatchesList breedings={batchesFiltered} />
      {/* {view === 'animals' ? (
        <AnimalsBreeding animals={animalsFiltered} />
      ) : (
        <BreedingBatchesList breedings={batchesFiltered} />
      )} */}
    </div>
  )
}

const AnimalsBreeding = ({ animals }: { animals: any[] }) => {
  const { arraySorted, handleSortBy, reverse } = useSortByField(animals)
  const sortByButtons = [
    { field: 'possibleBirthStartIn', label: 'Parto' },
    { field: 'earring', label: 'Arete' }
  ]
  return (
    <>
      <div>
        <div>Ordenar por:</div>
        <div className="flex w-full justify-evenly">
          {sortByButtons.map(({ field, label }) => (
            <button
              key={label}
              onClick={() => handleSortBy(field)}
              className="btn btn-sm btn-ghost"
            >
              {label}
              <span className="ml-1">
                <Icon name={reverse ? 'down' : 'up'} size="xs" />
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="text-center">Total: {animals.length}</div>
      <div className="  overflow-y-auto p-1 shadow-inner rounded-md event-list">
        {arraySorted.map((animal, i) => (
          <AnimalBreedingCard key={`${animal?.id}-${i}`} animal={animal} />
        ))}
      </div>
    </>
  )
}

export default BreedingsList
