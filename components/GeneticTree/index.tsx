import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import { AnimalType } from 'types/base/AnimalType.model'

interface GeneticTreeElement {
  id: AnimalType['id']
  label: AnimalType['earring']
}
const GeneticTree = ({
  parents
}: //onClick
{
  parents?: {
    father?: GeneticTreeElement
    mother?: GeneticTreeElement
  }
  onClick?: (element: GeneticTreeElement) => void
}) => {
  console.log({ parents })
  const mother = parents?.mother
  const father = parents?.father
  return (
    <div>
      <div className="flex items-center mx-auto w-full justify-center">
        <span className="mr-5 self-center">Genetica: </span>
        <div className="flex flex-col ">
          <span>
            Padre:
            {father ? (
              <ModalAnimalDetails earring={father?.label || ''} />
            ) : (
              'sin'
            )}
          </span>

          <span>
            Madre:
            {mother ? (
              <ModalAnimalDetails earring={mother?.label || ''} />
            ) : (
              'sin'
            )}
          </span>
        </div>
      </div>
    </div>
  )
}

export default GeneticTree
