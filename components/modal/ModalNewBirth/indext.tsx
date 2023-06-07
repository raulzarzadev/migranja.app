import useModal from '@comps/hooks/useModal'
import Modal from '..'

import BirthForm from '@comps/BreedingsList/AnimalBreedingOptions/BirthForm'
import useEvent from '@comps/hooks/useEvent'

const ModalNewBirth = ({
  motherId,
  breedingId,
  isBreedingBirth
}: {
  motherId: string
  breedingId: string
  isBreedingBirth?: boolean
}) => {
  const modal = useModal()
  const { event } = useEvent({ eventId: breedingId })
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
      <Modal
        {...modal}
        title={`Nuevo parto ${
          breedingId ? `de monta ${event?.eventData?.breedingId}` : 'sin monta'
        }`}
      >
        <BirthForm
          breedingId={breedingId}
          motherId={motherId}
          title={`Parto de monta`}
        />
      </Modal>
    </div>
  )
}

export default ModalNewBirth
