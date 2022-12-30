import { createAnimal } from '@firebase/Animal/main'
import {
  createBirthEvent,
  createEvent,
  getFarmBreedings
} from '@firebase/Events/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import useFarm from 'components/hooks/useFarm'
import useSortByField from 'components/hooks/useSortByField'
import Icon from 'components/Icon'
import DebouncedInput from 'components/inputs/DebouncedInput'
import InputContainer from 'components/inputs/InputContainer'
import Modal from 'components/modal'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'
import AnimalBreedingCard from './AnimalBreedingCard'
import AnimalBreedingOptions from './AnimalBreedingOptions'
import { formatBreedingsAsBreedingsList } from './breeding.helpers'

interface SearchField {
  value: string
  matches: AnimalType[]
}

const BreedingsList = () => {
  const { currentFarm } = useFarm()
  const [animals, setAnimals] = useState<Partial<AnimalType>[]>([])
  const [search, setSearch] = useState<SearchField>({ value: '', matches: [] })

  useEffect(() => {
    currentFarm.id &&
      !animals.length &&
      getFarmBreedings(currentFarm.id).then((res) =>
        setAnimals(formatBreedingsAsBreedingsList(res))
      )
  }, [animals.length, currentFarm.id])

  const filterField = (field: string = '', search: string = '') => {
    return field.toLowerCase().includes(search.toLowerCase())
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
          Encontrados {animalsFiltered.length}
        </div>
      </div>
      <AnimalsBreeding animals={animalsFiltered} />
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
      <div className="  overflow-y-auto p-1 shadow-inner rounded-md event-list">
        {arraySorted.map((animal, i) => (
          <AnimalBreedingCard key={`${animal?.id}-${i}`} animal={animal} />
        ))}
      </div>
    </>
  )
}

export default BreedingsList
