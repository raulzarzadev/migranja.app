import { getFarmBreedings } from '@firebase/Events/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import useFarm from 'components/hooks/useFarm'
import useSortByField from 'components/hooks/useSortByField'
import Icon from 'components/Icon'
import DebouncedInput from 'components/inputs/DebouncedInput'
import { useEffect, useState } from 'react'
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'
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
      getFarmBreedings(currentFarm.id).then((res) =>
        setAnimals(formatBreedingsAsBreedingsList(res))
      )
  }, [currentFarm.id])

  useEffect(() => {
    // search in earrig
    const earrigs = animals.filter(
      (animal) =>
        animal.earring?.includes(search.value) || // search earrings
        animal?.breeding?.breedingMale?.earring?.includes(search.value) // search breeding males
    )

    setSearch((state: any) => {
      return { ...state, matches: [...earrigs] }
    })
  }, [animals, search.value])

  return (
    <div className="w-full">
      <div className="flex w-full items-center">
        <DebouncedInput
          value={search.value ?? ''}
          onChange={(value) => setSearch({ ...search, value: String(value) })}
          className=" input input-sm w-full input-bordered"
          placeholder="Buscar..."
        />
        <div className="whitespace-nowrap ml-1">
          Encontrados {search.matches.length}
        </div>
      </div>
      <AnimalsBreeding animals={search.matches} />
    </div>
  )
}

const AnimalsBreeding = ({ animals }: { animals: any[] }) => {
  const { arraySorted, handleSortBy } = useSortByField(animals)
  return (
    <>
      <div>
        <div>Ordenar por:</div>
        <div className="flex w-full justify-evenly">
          {/* <button onClick={() => handleSortBy('possibleBirthStartIn')}>
            monta
          </button> */}
          <button onClick={() => handleSortBy('possibleBirthStartIn')}>
            parto
          </button>
          <button onClick={() => handleSortBy('earring')}>arete</button>
          {/* <button onClick={() => handleSortBy('')}>macho</button> */}
        </div>
      </div>
      {arraySorted.map((animal, i) => (
        <AnimalBreeding key={`${animal?.id}-${i}`} animal={animal} />
      ))}
    </>
  )
}

const AnimalBreeding = ({ animal }: { animal: Partial<AnimalType> }) => {
  const possibleBirthStartAt = animal?.breeding?.possibleBirth?.startAt
  const possibleBirthFinishAt = animal?.breeding?.possibleBirth?.finishAt
  const iconStyle: 'error' | 'warning' | 'success' =
    // @ts-ignore
    animal.possibleBirthStartIn < 0
      ? 'error'
      : // @ts-ignore
      animal.possibleBirthStartIn < 5
      ? 'warning'
      : 'success'
  return (
    <div className="bg-base-300 my-2 rounded-md shadow-md  ">
      <header className="flex w-full justify-between p-2 bg-base-200 rounded-t-md">
        <div className="flex items-center ">
          <span className="pr-1">
            {iconStyle === 'error' && (
              <span className="text-error ">
                <Icon name="baned" size="xs" />
              </span>
            )}
            {iconStyle === 'success' && (
              <span className="text-success ">
                <Icon name="done" size="xs" />
              </span>
            )}
            {iconStyle === 'warning' && (
              <span className="text-warning ">
                <Icon name="info" size="xs" />
              </span>
            )}
          </span>
          <span className="flex flex-col">
            <span>
              Parto: del{' '}
              <span className="font-bold">
                {possibleBirthStartAt &&
                  myFormatDate(possibleBirthStartAt, 'dd-MMM')}
              </span>{' '}
              al{' '}
              <span className="font-bold">
                {possibleBirthFinishAt &&
                  myFormatDate(possibleBirthFinishAt, 'dd-MMM yyyy')}
              </span>
            </span>
            <span className="text-xs italic">
              {fromNow(possibleBirthStartAt, { addSuffix: true })}
            </span>
          </span>
        </div>

        <span>
          Arete: <span className="font-bold">{animal.earring}</span>
        </span>
      </header>
      <main className="p-2">
        <div className="flex w-full justify-evenly">
          <div className="flex flex-col text-center">
            <span>Fecha Monta</span>
            <div>
              <span>
                {myFormatDate(animal?.breeding?.startAt, 'dd-MMM-yy')}
              </span>
              <span className="mx-2">al</span>
              <span>
                {myFormatDate(animal?.breeding?.finishAt, 'dd-MMM-yy')}
              </span>
            </div>
          </div>
          <div className="flex flex-col text-center">
            <span>Macho</span>
            <div>
              <span className="mx-2 font-bold">
                {animal.breeding?.breedingMale?.earring}
              </span>
              <span>{animal.breeding?.breedingMale?.name || ''}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default BreedingsList
