import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import { AnimalType } from 'types/base/AnimalType.model'
//import Autocomplete from 'react-autocomplete'
import findAnimalRelationships from 'utils/findAnimalRealtionships'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import { Controller, useFormContext } from 'react-hook-form'

interface SearchEarring {
  omitEarrings?: string[]
  //onEarringClick: ({ earring, id }: { earring: string; id: string }) => void
  gender?: 'male' | 'female' | 'all'
  placeholder?: string
  relativeTo?: AnimalType['earring']
  label?: string
  className?: string
  filterBy?: (animal: AnimalType) => any
  justStallion?: boolean
  onReset?: () => {}
  name: string
}
const SearchEarringController = ({
  // onEarringClick,
  omitEarrings = [],
  gender = 'all',
  placeholder = 'Buscar arete',
  relativeTo,
  className,
  label,
  filterBy = (animal) => [],
  justStallion,
  name,
  onReset
}: SearchEarring) => {
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

  return (
    <Controller
      name={name}
      render={({ field, fieldState, formState }) => {
        console.log(name, field)
        return (
          <Autocomplete
            disablePortal
            //id="combo-box-demo"
            options={options}
            onChange={(e, newValue) => {
              field.onChange(newValue?.id)
            }}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            // sx={{ width: 300 }}
            className={` ${className} `}
            renderInput={(params) => {
              return (
                <TextField {...params} label={label} className="z-0 my-2" />
              )
            }}
            renderOption={(props, option, { inputValue }) => {
              const matches = match(option.label, inputValue, {
                insideWords: true
              })
              const parts = parse(option.label, matches)
              return (
                <li
                  {...props}
                  className={`${props.className} 
        ${isRelative(option.label) && ' bg-error text-white'} 
        ${alreadyIn(option.label) && ' bg-slate-600 '}
        `}
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
                        <span className="ml-2">
                          {alreadyIn(option.label) && 'Ya esta en la lista'}
                        </span>
                      </span>
                    ))}
                  </div>
                </li>
              )
            }}
          />
        )
      }}
    />
  )
}

export type SearchEarringController = typeof SearchEarringController

export default SearchEarringController
