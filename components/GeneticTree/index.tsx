import LinkFarmAnimal from '@comps/Buttons&Links/LinkFarmAnimal'
import { AnimalType } from 'types/base/AnimalType.model'
import { AnimalBreedingType } from 'types/base/FarmEvent.model'
import { animalCurrentStatusLabels } from 'types/base/LABELS_TYPES/AnimalCurrentStatus'

interface GeneticTreeElement {
  id: string
  label: string
}
const LABELS = animalCurrentStatusLabels
const GeneticTree = ({
  elements,
  onClick
}: {
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
            Padre: {father?.label}{' '}
            <LinkFarmAnimal animalEarringOrId={father?.id} />
          </span>
          {!mothers && (
            <span>
              Madre: {mother?.label || '-'}{' '}
              <LinkFarmAnimal animalEarringOrId={mother?.id} />{' '}
            </span>
          )}
          {mothers && (
            <div className="flex">
              <span>Madres:</span>
              <div className="whitespace-nowrap">
                {mothers?.map((mom) => (
                  <div key={mom.earring} className="flex">
                    <div className="w-[120px] text-end pr-4">
                      {mom.earring}{' '}
                    </div>
                    <span>
                      {
                        LABELS[
                          (mom?.status as AnimalType['currentStatus']) ||
                            'PENDING'
                        ]
                      }
                    </span>
                    <LinkFarmAnimal animalEarringOrId={mom.earring} />
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
