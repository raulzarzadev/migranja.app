import { AnimalState } from 'types/base/AnimalState.model'
import { AnimalType } from 'types/base/AnimalType.model'
import GENDER_OPTIONS from './CONSTANTS/GENDER_OPTIONS'
import Icon from './Icon'

export interface Animal {
  earring?: AnimalType['earring']
  gender?: 'male' | 'female'
  id?: AnimalType['id']
  weight: number
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
  return (
    <div>
      {title && <h3 className="font-bold">{title}</h3>}
      <table className="table w-full table-compact">
        {!!animals.length && (
          <thead>
            <tr>
              <td>Arete</td>
              <td>Estado</td>
              <td>Sexo</td>
              <td>Peso</td>
              <td>Elim</td>
            </tr>
          </thead>
        )}
        <tbody>
          {animals.map((animal, i) => (
            <tr key={animal?.earring}>
              <td>{animal.earring}</td>
              <td className="capitalize">
                {AnimalState[animal.state || 'LACTATING']}
              </td>
              <td>{GENDER_OPTIONS[animal.gender || 'female'].label}</td>
              <td>{animal?.weight}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AnimalsCompatTable
