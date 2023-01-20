import { IconStatus } from '@comps/IconBreedingStatus'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import { AnimalType } from 'types/base/AnimalType.model'
import Autocomplete from 'react-autocomplete'
import findAnimalRelationships from 'utils/findAnimalRealtionships'

const SearchEarring = ({
  onEarringClick,
  omitEarrings = [],
  gender = 'all',
  placeholder = 'Buscar arete',
  relativeTo,
  className,
  label
}: {
  omitEarrings?: string[]
  onEarringClick: ({ earring, id }: { earring: string; id: string }) => void
  gender?: 'male' | 'female' | 'all'
  placeholder?: string
  relativeTo?: AnimalType['earring']
  label?: string
  className?: string
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
          gender === 'all' ? true : animal.gender === gender
        )
        .filter(
          (animal) =>
            animal?.earring?.includes(`${search}`) ||
            animal?.name?.includes(`${search}`)
        )
        .sort((a: any, b: any) => a.earring - b.earring)
      setMatches(animals)
    }
  }, [farmAnimals, gender, search])

  const alreadyIn = (earring: string) => {
    return omitEarrings.includes(earring)
  }
  const isRelative = (earring: string) =>
    relativeTo && !!findAnimalRelationships(earring, relativeTo, farmAnimals)

  return (
    <div className="flex w-full justify-center">
      <div className=" form-control relative ">
        {label && <span>{label}</span>}
        <Autocomplete
          inputProps={{
            placeholder,
            className: `input input-sm input-outline input-bordered w-full ${className} `
          }}
          getItemValue={(item) => item.label}
          items={matches.map((animal) => {
            return { label: animal.earring, id: animal.id, name: animal.name }
          })}
          renderItem={(item, isHighlighted) => (
            <div
              key={item.label}
              className={` ${isHighlighted ? ' bg-base-100 ' : ' bg-base-300 '} 
              ${isRelative(item.label) ? ' bg-error ' : ''}
              -m-1 pl-5 p-0.5 cursor-pointer rounded-lg py-1`}
            >
              <div className="flex">
                <div className="w-10">
                  {alreadyIn(item.label) ? <IconStatus status="success" /> : ''}
                </div>
                {item.label} {item.name}
              </div>
            </div>
          )}
          sortItems={(a, b) => a.label - b.label}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSelect={(val) => {
            !alreadyIn(val) && setSearch(val)
            !alreadyIn(val) &&
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

export default SearchEarring
