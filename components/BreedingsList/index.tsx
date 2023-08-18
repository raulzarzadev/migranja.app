import { listenFarmBreedings } from '@firebase/Events/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import DebouncedInput from 'components/inputs/DebouncedInput'
import { SetStateAction, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FarmStateAnimalEvent, selectFarmState } from 'store/slices/farmSlice'
import {
  BreedingDetailsEvent,
  FarmBreedingEvent,
  SetGenericEventType
} from 'types/base/FarmEvent.model'
import { myFormatDate } from 'utils/dates/myDateUtils'
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

export const formatBreedingBatchesAnimalsWithBreedingData = (
  breedings: FarmBreedingEvent[]
) =>
  breedings.map((batch) => {
    if (!batch) return null
    const breedingDates = calculatePossibleBirthStartAndFinish({
      finishAt: batch?.eventData?.finishAt as number,
      startAt: batch?.eventData?.startAt as number,
      //@ts-ignore // FIXME: this should be fixed
      otherMales: batch?.eventData?.otherMales
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
        ...batch?.eventData,
        breedingBatch: animals,
        breedingDates
      }
    }
  })

const BreedingsList = () => {
  const currentFarm = useSelector(selectFarmState)
  const [farmEvents, setFarmEvents] = useState<
    AnimalFormattedWithBreedingDates[]
  >([])

  useEffect(() => {
    if (currentFarm?.id) {
      // getFarmBreedings(currentFarm?.id).then((res) => {
      //   setFarmEvents(res)
      // })
      listenFarmBreedings(
        currentFarm.id,
        (res: SetStateAction<AnimalFormattedWithBreedingDates[]>) =>
          setFarmEvents(res)
      )
    }
  }, [currentFarm?.id])

  const [search, setSearch] = useState<SearchField>({ value: '', matches: [] })
  const [view, setView] = useState<'breeding' | 'animals' | 'finish'>(
    'breeding'
  )

  const [breedingsByBatch, setBreedingsByBatch] = useState<
    SetGenericEventType<BreedingDetailsEvent>[]
  >([])

  const [breedingsByAnimals, setBreedingsByAnimals] = useState<any[]>([])

  const filterField = (field: string = '', search: string = '') => {
    return field?.toLowerCase()?.includes(search?.toLowerCase())
  }

  useEffect(() => {
    const formattedBreeding = formatBreedingBatchesAnimalsWithBreedingData(
      farmEvents as any
    )

    const asAnimals = formattedBreeding?.map((event) =>
      event?.eventData?.breedingBatch?.map((animal) => animal)
    )
    setBreedingsByAnimals(
      asAnimals.flat()
      //.filter((animal) => ['PREGNANT', 'PENDING'].includes(animal?.status))
    )
    const pendingBirthsInBreeding = formattedBreeding?.filter((event) =>
      event?.eventData?.breedingBatch?.find((animal) =>
        ['PREGNANT', 'PENDING'].includes(animal.status)
      )
    )
    // @ts-ignore
    setBreedingsByBatch(pendingBirthsInBreeding)

    setFinishedBreedings(
      formattedBreeding.filter(
        (event) =>
          !event?.eventData?.breedingBatch?.find((animal) =>
            ['PREGNANT', 'PENDING'].includes(animal.status)
          )
      )
    )
  }, [farmEvents])

  const [animalsFiltered, setAnimalsFilter] = useState<FarmStateAnimalEvent[]>(
    []
  )

  const [batchesFiltered, setBreedingFilter] = useState<any[]>([])
  const [finishedBreedingsFiltered, setFinishedBreedingsFilter] = useState<
    any[]
  >([])
  const [finishedBreedings, setFinishedBreedings] = useState<any[]>([])
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

    const batchesFiltered = [...breedingsByBatch].filter(
      (batch) =>
        // filter  by bull
        filterField(
          batch.eventData.breedingMale?.earring || '',
          search.value
        ) ||
        // filter by animal in batch
        batch.eventData.breedingBatch.find((animal) =>
          animal.earring
            ?.toLocaleUpperCase()
            ?.includes(search.value.toLocaleUpperCase())
        )
    )

    const finishedFiltered = [...finishedBreedings].filter(
      (batch) =>
        // filter  by bull
        filterField(
          batch.eventData.breedingMale?.earring || '',
          search.value
        ) ||
        // filter by animal in batch
        batch.eventData.breedingBatch.find((animal: { earring: string }) =>
          animal.earring
            ?.toLocaleUpperCase()
            ?.includes(search.value.toLocaleUpperCase())
        )
    )

    setAnimalsFilter(animalsFiltered)
    setBreedingFilter(batchesFiltered)
    setFinishedBreedingsFilter(finishedFiltered)
  }, [
    breedingsByAnimals,
    breedingsByBatch,
    farmEvents,
    finishedBreedings,
    search.value
  ])

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
        <button
          className={`btn btn-sm btn-outline ${
            view == 'finish' ? 'btn-active' : ''
          }`}
          onClick={() => setView('finish')}
        >
          Terminadas
        </button>
      </div>
      {view === 'animals' && <BreedingsByAnimals animals={animalsFiltered} />}
      {view === 'breeding' && (
        <BreedingsByBatches breedings={batchesFiltered} />
      )}
      {view === 'finish' && (
        <BreedingsByBatches breedings={finishedBreedingsFiltered} />
      )}
    </div>
  )
}

export default BreedingsList
