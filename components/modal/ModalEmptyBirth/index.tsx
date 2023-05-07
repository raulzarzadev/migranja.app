import useModal from '@comps/hooks/useModal'
import Modal from '..'
import EmptyPregnantForm from '@comps/BreedingsList/AnimalBreedingOptions/EmptyPregnantForm'
import { AnimalType } from 'types/base/AnimalType.model'
import { FarmEvent } from 'types/base/FarmEvent.model'

const ModalEmptyBirth = ({
  motherId,
  breedingId
}: {
  motherId: AnimalType['id']
  breedingId: FarmEvent['id']
}) => {
  const modal = useModal()
  return (
    <div>
      <button
        onClick={(e) => {
          e.preventDefault()
          modal.handleOpen()
        }}
        className="btn btn-outline"
      >
        Vacio
      </button>
      <Modal {...modal} title="Monta vacia">
        <EmptyPregnantForm motherId={motherId} breedingId={breedingId} />
      </Modal>
    </div>
  )
}

export default ModalEmptyBirth
