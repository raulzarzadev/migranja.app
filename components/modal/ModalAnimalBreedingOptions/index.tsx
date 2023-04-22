import useModal from '@comps/hooks/useModal'
import Modal from '..'
import ModalNewBirth from '../ModalNewBirth/indext'
import { AnimalType } from 'types/base/AnimalType.model'
import { EventType } from '@firebase/Events/event.model'
import { ReactNode } from 'react'

const ModalAnimalBreedingOptions = ({
  children,
  breedingId,
  motherId
}: {
  motherId: AnimalType['id']
  breedingId: EventType['id']
  children: ReactNode
}) => {
  const modal = useModal()
  const defaultButton = 'Detalles de parto'

  return (
    <div>
      <button
        onClick={(e) => {
          //console.log({ e })
          modal.handleOpen()
        }}
        className="w-full"
      >
        {children || defaultButton}
      </button>
      {modal.open && (
        <Modal
          open={modal.open}
          handleOpen={modal.handleOpen}
          title="Detalles de monta individual"
        >
          <div>
            <ModalNewBirth motherId={motherId} breedingId={breedingId} />
            {/* <button>Descartar animal</button>
            <button>Vacio</button> */}
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ModalAnimalBreedingOptions
