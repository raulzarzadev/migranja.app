import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import BreedingBatchesList from 'components/BreedingBatchesList'
import useDebugInformation from 'components/hooks/useDebugInformation'
import useFarm from 'components/hooks/useFarm'
import useSortByField from 'components/hooks/useSortByField'
import Icon from 'components/Icon'
import DebouncedInput from 'components/inputs/DebouncedInput'
import Loading from 'components/Loading'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmEvents } from 'store/slices/farmSlice'
import {
  BreedingDetailsEvent,
  EventDataStoreDetails,
  FarmBreedingEvent,
  SetGenericEventType
} from 'types/base/FarmEvent.model'
import AnimalBreedingCard from './AnimalBreedingCard'
import {
  BreedingDatesType,
  calculatePossibleBirthStartAndFinish,
  formatBreedingsGenericEvent
} from './breeding.helpers'

interface SearchField {
  value: string
  matches: AnimalType[]
}
interface AnimalFormattedWithBreedingDates extends Partial<AnimalType> {
  // breedingDates: BreedingDatesType
}
const BreedingsList = () => {
  const farmEvents = useSelector(selectFarmEvents)

  const [search, setSearch] = useState<SearchField>({ value: '', matches: [] })
  const [view, setView] = useState<'breeding' | 'animals'>('breeding')

  const [breedingsByBatch, setBreedingsByBatch] = useState<
    SetGenericEventType<BreedingDetailsEvent>[]
  >([])

  const [breedingsByAnimals, setBreedingsByAnimals] = useState<
    AnimalFormattedWithBreedingDates[]
  >([])

  // useDebugInformation('BreedingsList', {})

  const filterField = (field: string = '', search: string = '') => {
    return field?.toLowerCase()?.includes(search?.toLowerCase())
  }

  useEffect(() => {
    // console.log(formatBreedingBatchesAnimalsWithBreedingData)
    const breedingBatches = farmEvents.filter(
      (event) => event.type === 'BREEDING'
    )
    // console.log({ breedingBatches })
    const formatBreedingBatchesAnimalsWithBreedingData = breedingBatches.map(
      (batch) => {
        const breedingDates = calculatePossibleBirthStartAndFinish({
          finishAt: batch.eventData.finishAt as number,
          startAt: batch.eventData.startAt as number
        })
        const animals = batch.eventData.breedingBatch?.map((animal) => {
          return {
            ...animal,
            eventData: { ...batch.eventData, id: batch.id, breedingDates }
          }
        })

        return {
          ...batch,
          eventData: {
            ...batch.eventData,
            breedingBatch: animals,
            breedingDates
          }
        }
      }
    )
    const animals = formatBreedingBatchesAnimalsWithBreedingData.map(
      (breedingBatch) =>
        breedingBatch.eventData.breedingBatch.map((animal) => animal)
    )
    setBreedingsByBatch(formatBreedingBatchesAnimalsWithBreedingData)
    setBreedingsByAnimals(animals.flat())
  }, [farmEvents])

  const [animalsFiltered, setAnimalsFilter] = useState([])
  const [batchesFiltered, setBreedingFilter] = useState([])

  useEffect(() => {
    const animalsFiltered = [...breedingsByAnimals].filter(
      (animal) =>
        // filter  earrings
        filterField(animal?.earring, search.value) ||
        // filter  by bull
        filterField(animal?.breeding?.breedingMale?.earring, search.value) ||
        // filter  by batch
        filterField(animal?.batch || '', search.value)
    )

    const batchesFiltered = [...breedingsByBatch].filter((batch) =>
      // filter  by bull
      filterField(batch.eventData.breedingMale?.earring || '', search.value)
    )
    setAnimalsFilter(animalsFiltered)
    setBreedingFilter(batchesFiltered)
  }, [breedingsByAnimals, breedingsByBatch, farmEvents, search.value])

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
      {/*  */}
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
