import { IconStatus } from '@comps/IconBreedingStatus'
import DebouncedInput from '@comps/inputs/DebouncedInput'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import { AnimalType } from 'types/base/AnimalType.model'

const SearchEarring = ({
  onEarringClick,
  omitEarrings = [],
  gender = 'all'
}: {
  omitEarrings?: string[]
  onEarringClick: ({ earring, id }: { earring: string; id: string }) => void
  gender?: 'male' | 'female' | 'all'
}) => {
  const [search, setSearch] = useState<string | number>('')
  const [matches, setMatches] = useState<AnimalType[]>([])
  const farmAnimals = useSelector(selectFarmAnimals)

  useEffect(() => {
    if (!search) {
      setMatches([])
    } else {
      const animals = farmAnimals
        .filter((animal) =>
          gender === 'all' ? animal : animal.gender === gender
        )
        .filter(
          (animal) =>
            animal.earring.includes(`${search}`) ||
            animal.batch?.includes(`${search}`)
        )
        .sort((a: any, b: any) => a.earring - b.earring)

      setMatches(animals)
    }
  }, [farmAnimals, search])

  const alreadyIn = (earring: string) => {
    return omitEarrings.includes(earring)
  }
  return (
    <div>
      <div className="text-center">
        <DebouncedInput
          onChange={(e) => setSearch(e)}
          value={search}
          placeholder="Buscar arete"
          className="input input-bordered input-sm"
        />
      </div>
      <div className="w-[250px] mx-auto">
        <div className="grid grid-cols-5 my-1 items-center place-items-center  text-sm">
          <div className="w-7">Ya</div>
          <div>Arete</div>
          <div>Nombre</div>
          <div className="col-span-2">Lote</div>
        </div>
        <div className="max-h-40 overflow-y-auto w-full">
          {matches.map((animal) => (
            <div
              key={animal?.id}
              onClick={(e) => {
                e.preventDefault()
                !alreadyIn(animal.earring) &&
                  onEarringClick({ earring: animal.earring, id: animal.id })
              }}
              className="hover:bg-base-300 cursor-pointer px-2"
            >
              <div className="grid grid-cols-5 my-1 items-center place-items-center ">
                <div className="w-7 ">
                  {alreadyIn(animal.earring) ? (
                    <IconStatus status="success" />
                  ) : (
                    ''
                  )}
                </div>
                <span className="font-bold">{animal.earring}</span>
                <span> {animal.name}</span>
                <span className="col-span-2"> {animal.batch}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchEarring
