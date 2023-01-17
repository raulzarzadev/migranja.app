import LinkFarmAnimal from '@comps/Buttons&Links/LinkFarmAnimal'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import { AnimalType } from 'types/base/AnimalType.model'
import { AnimalBreedingType } from 'types/base/FarmEvent.model'
import { animalCurrentStatusLabels } from 'types/base/LABELS_TYPES/AnimalCurrentStatus'

interface GeneticTreeElement {
  id: AnimalType['id']
  label: AnimalType['earring']
}
const LABELS = animalCurrentStatusLabels
const GeneticTree = ({
  elements
}: //onClick
{
  elements: {
    father?: GeneticTreeElement
    mother?: GeneticTreeElement
    mothers?: any[]
  }
  onClick?: (element: GeneticTreeElement) => void
}) => {
  const mother = elements?.mother
  const father = elements?.father
  const mothers = elements?.mothers
  return (
    <div>
      <div className="flex items-center mx-auto w-full justify-center">
        <span className="mr-5 self-start">Genetica: </span>
        <div className="flex flex-col ">
          <span>
            Padre:
            <ModalAnimalDetails earring={father?.label || ''} />
          </span>
          {!mothers && (
            <span>
              Madre:
              <ModalAnimalDetails earring={mother?.label || ''} />
            </span>
          )}
          {mothers && (
            <div className="flex">
              <span>Madres:</span>
              <div className="whitespace-nowrap">
                {mothers?.map((mom) => (
                  <div key={mom.earring} className="flex">
                    <ModalAnimalDetails earring={mom.earring} />

                    <span>
                      {
                        LABELS[
                          (mom?.status as AnimalType['currentStatus']) ||
                            'PENDING'
                        ]
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GeneticTree
