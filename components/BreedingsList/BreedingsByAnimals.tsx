import useSortByField from 'components/hooks/useSortByField'
import Icon from 'components/Icon'
import { AnimalFormattedWhitGenericEvenData } from 'types/base/AnimalType.model'
import AnimalBreedingCard from './AnimalBreedingCard'

const BreedingsByAnimals = ({
  animals
}: {
  animals: AnimalFormattedWhitGenericEvenData[]
}) => {
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

export default BreedingsByAnimals
