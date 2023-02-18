import InventoryForm from '@comps/InventoryForm'
import AsyncModal from '@comps/modal/AsyncModal'
import DropInForm from '../DropInForm'
import DropOutForm from '../DropOutForm'
import SellForm from '../SellForm'

const ChooseEventForm = ({
  title,
  animalsSelected,
  setAnimalsSelected
}: {
  title?: string
  animalsSelected: any[]
  setAnimalsSelected?: (animals: any[]) => void
}) => {
  const animalsIds = animalsSelected.map((animal) => animal.id)
  const EVENTS_FORMS = {
    // default: <DefaultFormInfo />,
    dropOut: (
      <DropOutForm
        animalsIds={animalsIds}
        setAnimals={() => setAnimalsSelected?.([])}
      />
    ),
    // dropIn: <DropInForm animalsIds={animalsIds} />,
    sell: (
      <SellForm
        hiddenSearchAnimals
        preSelectedAnimals={animalsSelected.map(({ earring }) => ({
          earring,
          weight: 0
        }))}
        onFinishSale={() => setAnimalsSelected?.([])}
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
    //dropIn: 'Dar de alta',
    sell: 'Vender',
    inventory: 'Inventario'
  }
  return (
    <div className="grid grid-cols-3 gap-4">
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
              hiddenButtons
            >
              <>{value}</>
            </AsyncModal>
          </div>
        )
      })}
    </div>
  )
}

export default ChooseEventForm
