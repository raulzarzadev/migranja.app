import { listenFarmBreedings } from '@firebase/Events/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import BreedingBatchesList from 'components/BreedingBatchesList'
import { BreedingBatchesListType } from 'components/BreedingBatchesList'
import useFarm from 'components/hooks/useFarm'
import useSortByField from 'components/hooks/useSortByField'
import Icon from 'components/Icon'
import DebouncedInput from 'components/inputs/DebouncedInput'
import { useEffect, useState } from 'react'
import AnimalBreedingCard from './AnimalBreedingCard'
import { formatAnimalsBreedings } from './breeding.helpers'

interface SearchField {
  value: string
  matches: AnimalType[]
}

const BreedingsList = () => {
  const { currentFarm } = useFarm()
  const [animals, setAnimals] = useState<Partial<AnimalType>[]>([])
  const [search, setSearch] = useState<SearchField>({ value: '', matches: [] })
  const [batches, setBatches] = useState<BreedingBatchesListType['breedings']>(
    []
  )
  useEffect(() => {
    currentFarm.id &&
      listenFarmBreedings(
        currentFarm.id,
        (res: BreedingBatchesListType['breedings']) => {
          const formattedBreedings = formatAnimalsBreedings(res)
          setBatches(formattedBreedings)
          const allAnimals = formattedBreedings?.map((batch) => batch.animals)
          setAnimals(allAnimals.flat())
          // setAnimals(formatBreedingsAsBreedingsList(res))
          // setBatches(res)
        }
      )
  }, [animals.length, currentFarm.id])
  const filterField = (field: string = '', search: string = '') => {
    return field?.toLowerCase()?.includes(search?.toLowerCase())
  }

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
    filterField(batch?.breedingMale?.earring || '', search.value)
  )

  const [view, setView] = useState<'breeding' | 'animals'>('breeding')
  console.log(batchesFiltered)

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
        <AnimalsBreeding animals={animalsFiltered} />
      ) : (
        <BreedingBatchesList breedings={batchesFiltered} />
      )}
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
