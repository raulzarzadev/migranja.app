import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import { AnimalType } from 'types/base/AnimalType.model'
//import Autocomplete from 'react-autocomplete'
import findAnimalRelationships from 'utils/findAnimalRealtionships'
import IconStatus from '@comps/IconStatus'
import ComboBox from '@comps/Autocomplete'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'

const SearchEarring = ({
  onEarringClick,
  omitEarrings = [],
  gender = 'all',
  placeholder = 'Buscar arete',
  relativeTo,
  className,
  label,
  filterBy = (animal) => [],
  justStallion
}: {
  omitEarrings?: string[]
  onEarringClick: ({ earring, id }: { earring: string; id: string }) => void
  gender?: 'male' | 'female' | 'all'
  placeholder?: string
  relativeTo?: AnimalType['earring']
  label?: string
  className?: string
  filterBy?: (animal: AnimalType) => any
  justStallion?: boolean
}) => {
  const [search, setSearch] = useState<string | number>('')
  const [matches, setMatches] = useState<AnimalType[]>([])
  const farmAnimals = useSelector(selectFarmAnimals)

  useEffect(() => {
    const animals = farmAnimals
      //* Aply a custom filter i exist. Elseware retur all animals
      .filter((animal) => filterBy?.(animal))
      //* Aplay gender filter in animls
      .filter((animal) => (gender === 'all' ? true : animal.gender === gender))

      //* filter stallions
      .filter((a) => (justStallion ? a.isStallion === true : true))
      //* Aplay search filters
      .filter(
        (animal) =>
          animal?.earring?.includes(`${search}`) ||
          animal?.name?.includes(`${search}`)
      )

      .sort((a: any, b: any) => a.earring - b.earring)
    setMatches(animals)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmAnimals, gender, search])

  const alreadyIn = (earring: string) => {
    return omitEarrings.includes(earring)
  }
  const isRelative = (earring: string) =>
    relativeTo && findAnimalRelationships(earring, relativeTo, farmAnimals)

  const options = matches
    .map((animal) => ({
      label: animal.earring,
      id: animal.id,
      name: animal.name
    }))
    .sort((a, b) => {
      if (a.label > b.label) return 1
      if (a.label < b.label) return -1
      return 0
    })
  console.log({ relativeTo })

  return (
    <>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={options}
        // sx={{ width: 300 }}
        className={` ${className} `}
        renderInput={(params) => (
          <TextField {...params} label={label} className="z-0" />
        )}
        // renderOption={(props, option, state) => (
        //   <li
        //     {...props}
        //     className={`${isRelative(option.label) && 'bg-error'}`}
        //   >{`${option.label} ${option.name || ''}`}</li>
        // )}
        renderOption={(props, option, { inputValue }) => {
          const matches = match(option.label, inputValue, {
            insideWords: true
          })
          const parts = parse(option.label, matches)

          return (
            <li
              {...props}
              className={`${props.className} ${
                isRelative(option.label) && ' bg-error text-white'
              } `}
            >
              <div>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{
                      fontWeight: part.highlight ? 700 : 400
                    }}
                  >
                    {part.text}
                    <span className="ml-2">{isRelative(option.label)}</span>
                  </span>
                ))}
              </div>
            </li>
          )
        }}
        onChange={(e, newValue) =>
          onEarringClick({
            earring: newValue?.label || '',
            id: newValue?.id || ''
          })
        }
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
      {/* <Autocomplete
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
        ></Autocomplete> */}
    </>
  )
}

export default SearchEarring
