import useModal from '@comps/hooks/useModal'
import Modal from '..'
import RevertBirthForm from '@comps/forms/RevertBirthForm'

const ModalRevertBirth = ({
  birthId,
  breedingId,
  motherId
}: {
  birthId: string
  breedingId: string
  motherId: string
}) => {
  const revertModal = useModal()
  return (
    <div className="text-center mt-4">
      <button
        onClick={() => {
          revertModal.handleOpen()
        }}
        className="btn btn-error btn-outline"
      >
        Revertir parto
      </button>
      <Modal
        open={revertModal.open}
        handleOpen={revertModal.handleOpen}
        title="Revertir parto"
      >
        <RevertBirthForm
          birthEventId={birthId}
          breedingId={breedingId}
          motherId={motherId}
        />
      </Modal>
    </div>
  )
}

export default ModalRevertBirth
