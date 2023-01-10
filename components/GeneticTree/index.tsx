import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'

interface GeneticTreeElement {
  id: string
  label: string
}
const LABELS: Record<NonNullable<AnimalType['status']>, string> = {
  BIRTH: 'Parto',
  ABORT: 'Aborto',
  EMPTY: 'Vacio',
  PENDING: 'Pendiente',
  ALL: 'Todo'
}
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
          <span>Padre: {father?.label}</span>
          {!mothers && <span>Madre: {mother?.label || '-'}</span>}
          {mothers && (
            <div className="flex">
              <span>Madres:</span>
              <div>
                {mothers.map((mom) => (
                  <div key={mom.earring} className="flex">
                    <div className="w-[80px] text-end pr-4">{mom.earring}</div>
                    <span>
                      {LABELS[mom?.status as NonNullable<AnimalType['status']>]}
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
