import InventoryForm from '@comps/InventoryForm'
import AsyncModal from '@comps/modal/AsyncModal'
import { useState } from 'react'
import { AnimalType } from 'types/base/AnimalType.model'
import DropInForm from '../DropInForm'
import DropOutForm from '../DropOutForm'
import SellForm from '../SellForm'

const ChooseEventForm = ({
  // animalsIds,
  title,
  animalsSelected
}: {
  title?: string
  animalsSelected: any[]
  //animalsIds: AnimalType['id'][]
}) => {
  const animalsIds = animalsSelected.map((animal) => animal.id)
  const EVENTS_FORMS = {
    // default: <DefaultFormInfo />,
    dropOut: <DropOutForm animalsIds={animalsIds} />,
    dropIn: <DropInForm animalsIds={animalsIds} />,
    sell: (
      <SellForm
        hiddenSearchAnimals
        preSelectedAnimals={animalsSelected.map(({ earring }) => ({
          earring,
          weight: 0
        }))}
      />
    ),
    inventory: (
      <InventoryForm
        animalsIds={animalsIds}
        inventoryType={`partial/${title}`}
      />
    )
  } as const
  type EventName = keyof typeof EVENTS_FORMS

  //const [optionSelected, setOptionSelected] = useState<EventName>('default')
  const eventsNames: Record<EventName, string> = {
    dropOut: 'Dar de baja',
    dropIn: 'Dar de alta',
    sell: 'Vender',
    inventory: 'Inventario'
  }
  return (
    <div className="grid grid-cols-4 gap-4">
      {Object.entries(EVENTS_FORMS).map(([key, value]) => {
        return (
          <div key={key}>
            <AsyncModal
              btnLabel={eventsNames[key as EventName]}
              handleAccept={function (): Promise<number | boolean> {
                throw new Error('Function not implemented.')
              }}
              openButtonClassName={'btn btn-outline w-full'}
              modalTitle={eventsNames[key as EventName]}
            >
              <>{value}</>
            </AsyncModal>
          </div>
        )
      })}
    </div>
  )
}

const DefaultFormInfo = () => {
  return (
    <div className="h-32 w-full max-w-2/3 flex justify-center items-center flex-col max-w-xs mx-auto text-center">
      <p className="my-4">
        Segun el evento, habra diferentes campos que llenar.
      </p>
      <p>
        Se cuidadoso, este evento afectara a todos los animales previamente
        seleccionados.
      </p>
    </div>
  )
}

export default ChooseEventForm
