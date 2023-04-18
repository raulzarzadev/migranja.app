import useModal from '@comps/hooks/useModal'
import Modal from '..'
import BirthForm from '@comps/BreedingsList/AnimalBreedingOptions/BirthForm'

const ModalNewBirth = ({
  motherId,
  breedingId
}: {
  motherId: string
  breedingId: string
}) => {
  const modal = useModal()
  return (
    <div>
      <button
        className="btn btn-outline btn-info"
        onClick={(e) => {
          modal.handleOpen()
        }}
      >
        Parto
      </button>
      <Modal {...modal} title="Nuevo parto">
        <BirthForm motherId={motherId} breedingId={breedingId} />
      </Modal>
    </div>
  )
}

export default ModalNewBirth
