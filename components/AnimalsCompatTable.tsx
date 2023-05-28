import { AnimalState } from 'types/base/AnimalState.model'
import { AnimalType } from 'types/base/AnimalType.model'
import GENDER_OPTIONS from './CONSTANTS/GENDER_OPTIONS'
import Icon from './Icon'

export interface Animal {
  earring?: AnimalType['earring']
  gender?: 'male' | 'female'
  id?: AnimalType['id']
  weight: number | null
  state: AnimalType['state']
}
const AnimalsCompatTable = ({
  animals,
  onRemove,
  title
}: {
  animals: Animal[]
  onRemove?: (index: number) => void
  title?: string
}) => {
  const haveSimpleWeight = animals.every(
    (animals) => typeof animals.weight === 'number'
  )
  return (
    <div className="my-4">
      {title && <h3 className="font-bold text-center text-xl">{title}</h3>}
      <table className="table w-full table-compact">
        <thead>
          <tr>
            <td>Arete</td>
            <td>Estado</td>
            <td>Sexo</td>
            {haveSimpleWeight && <td>Peso</td>}
            {onRemove ? <td>Elim</td> : <></>}
          </tr>
        </thead>

        <tbody>
          {!animals.length && (
            <tr>
              <td colSpan={10} className="text-center">
                {' '}
                Aún no has agregado animales
              </td>
            </tr>
          )}
          {animals.map((animal, i) => (
            <tr key={animal?.earring}>
              <td>{animal.earring}</td>
              <td className="capitalize">
                {AnimalState[animal.state || 'LACTATING']}
              </td>
              <td>{GENDER_OPTIONS[animal.gender || 'female'].label}</td>
              {haveSimpleWeight && <td>{animal?.weight}</td>}
              {onRemove ? (
                <td>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      onRemove?.(i)
                    }}
                    className="btn btn-outline btn-circle btn-error btn-xs"
                  >
                    <Icon name="delete" size="xs" />
                  </button>
                </td>
              ) : (
                <></>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AnimalsCompatTable
