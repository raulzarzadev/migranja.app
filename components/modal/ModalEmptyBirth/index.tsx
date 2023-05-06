import useModal from '@comps/hooks/useModal'
import Modal from '..'
import EmptyPregnantForm from '@comps/BreedingsList/AnimalBreedingOptions/EmptyPregnantForm'

const ModalEmptyBirth = () => {
  const modal = useModal()
  return (
    <div>
      <button
        onClick={(e) => {
          e.preventDefault()
          modal.handleOpen()
        }}
      ></button>
      <Modal {...modal} title="Monta vacia">
        <EmptyPregnantForm />
      </Modal>
    </div>
  )
}

export default ModalEmptyBirth
