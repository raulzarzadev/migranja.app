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
    dropOut: {
      formComponent: (
        <DropOutForm
          animalsIds={animalsIds}
          setAnimals={() => setAnimalsSelected?.([])}
        />
      ),
      label: 'Dar de baja'
    },
    // dropIn: <DropInForm animalsIds={animalsIds} />,
    sell: {
      formComponent: (
        <SellForm
          hiddenSearchAnimals
          preSelectedAnimals={animalsSelected.map(({ earring }) => ({
            earring,
            weight: 0
          }))}
          onFinishSale={() => setAnimalsSelected?.([])}
        />
      ),
      label: 'Vender'
    },
    inventory: {
      formComponent: (
        <InventoryForm
          animalsIds={animalsIds}
          inventoryType={`partial/${title}`}
        />
      ),
      label: 'Inventario'
    }
  } as const

  return (
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(EVENTS_FORMS).map(([key, value]) => {
        return (
          <div key={key}>
            <AsyncModal
              btnLabel={value.label}
              handleAccept={function (): Promise<number | boolean> {
                throw new Error('Function not implemented.')
              }}
              openButtonClassName={'btn btn-outline w-full'}
              modalTitle={value.label}
              hiddenButtons
            >
              <>{value.formComponent}</>
            </AsyncModal>
          </div>
        )
      })}
    </div>
  )
}

export default ChooseEventForm
