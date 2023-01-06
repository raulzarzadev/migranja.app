import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import DebouncedInput from 'components/inputs/DebouncedInput'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FarmStateAnimalEvent, selectFarmEvents } from 'store/slices/farmSlice'
import {
  BreedingDetailsEvent,
  SetGenericEventType
} from 'types/base/FarmEvent.model'
import { calculatePossibleBirthStartAndFinish } from './breeding.helpers'
import BreedingsByAnimals from './BreedingsByAnimals'
import BreedingsByBatches from './BreedingsByBatches'

interface SearchField {
  value: string
  matches: AnimalType[]
}
interface AnimalFormattedWithBreedingDates extends Partial<AnimalType> {
  // breedingDates: BreedingDatesType
}
const BreedingsList = () => {
  const farmEvents = useSelector(selectFarmEvents)
  console.log(farmEvents)
  const [search, setSearch] = useState<SearchField>({ value: '', matches: [] })
  const [view, setView] = useState<'breeding' | 'animals'>('breeding')

  const [breedingsByBatch, setBreedingsByBatch] = useState<
    SetGenericEventType<BreedingDetailsEvent>[]
  >([])

  const [breedingsByAnimals, setBreedingsByAnimals] = useState<any[]>([])

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
          finishAt: batch?.eventData?.finishAt as number,
          startAt: batch?.eventData?.startAt as number
        })
        const animals = batch?.eventData?.breedingBatch?.map((animal) => {
          return {
            ...animal,
            eventData: { ...batch?.eventData, id: batch.id, breedingDates }
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

  const [animalsFiltered, setAnimalsFilter] = useState<FarmStateAnimalEvent[]>(
    []
  )
  const [batchesFiltered, setBreedingFilter] = useState<any[]>([])

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
      {view === 'animals' ? (
        <BreedingsByAnimals animals={animalsFiltered} />
      ) : (
        <BreedingsByBatches breedings={batchesFiltered} />
      )}
    </div>
  )
}

export default BreedingsList
