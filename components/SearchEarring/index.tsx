import { IconStatus } from '@comps/IconBreedingStatus'
import DebouncedInput from '@comps/inputs/DebouncedInput'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import { AnimalType } from 'types/base/AnimalType.model'
import Autocomplete from 'react-autocomplete'

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
  }, [farmAnimals, gender, search])

  const alreadyIn = (earring: string) => {
    return omitEarrings.includes(earring)
  }
  return (
    <div className="flex w-full justify-center">
      <div className=" relative">
        <Autocomplete
          open
          inputProps={{
            placeholder: 'Busca arete',
            className: 'input input-sm input-outline input-bordered w-full '
          }}
          getItemValue={(item) => item.label}
          items={matches.map((animal) => {
            return { label: animal.earring, id: animal.id, name: animal.name }
          })}
          renderItem={(item, isHighlighted) => (
            <div
              key={item.label}
              className={` ${
                isHighlighted ? ' bg-base-100 ' : ' bg-base-300 '
              }  -m-1 pl-5 p-0.5 cursor-pointer rounded-lg py-1`}
            >
              {item.label} {item.name}
            </div>
          )}
          sortItems={(a, b) => a.label - b.label}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSelect={(val) => {
            setSearch(val)
            onEarringClick({
              earring: val,
              id: matches.find(({ earring }) => earring === val)?.id || ''
            })
          }}
        ></Autocomplete>
      </div>
    </div>
  )
}

/* ******************************************** 
              <DebouncedInput
          onChange={(e) => setSearch(e)}
          value={search}
          placeholder="Buscar arete"
          className="input input-bordered input-sm"
        />
        <div className="w-[280px] mx-auto absolute bg-base-200 rounded-md shadow-2xl ">
          <div className="grid grid-cols-3 my-1 items-center place-items-center  text-sm">
            <div className="w-7">Ya</div>
            <div>Arete</div>
            <div>Nombre</div>
            {/* <div className="col-span-2">Lote</div> 
          </div>
          <div className="max-h-40 overflow-y-auto w-full ">
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
                <div className="grid grid-cols-3 my-1  ">
                  <div className="w-7 ">
                    {alreadyIn(animal.earring) ? (
                      <IconStatus status="success" />
                    ) : (
                      ''
                    )}
                  </div>
                  <span className="font-bold">{animal.earring}</span>
                  <span> {animal.name}</span>
                  {/* <span className="col-span-2"> {animal.batch}</span> 
                </div>
              </div>
            ))}
          </div>
        </div>               
 *******************************************rz */

export default SearchEarring
