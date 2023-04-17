import useModal from '@comps/hooks/useModal'
import Modal from '..'
import useEvent from '@comps/hooks/useEvent'
import useAnimal from '@comps/hooks/useAnimal'
import AnimalBreedingOptions from '@comps/BreedingsList/AnimalBreedingOptions'

const ModalAnimalBreedingOptions = ({ children, breedingId, animalId }) => {
  const { event } = useEvent({ eventId: breedingId })

  const { animal } = useAnimal({ animalId })

  console.log(breedingId)

  const modal = useModal()
  const defaultButton = 'Detalles de parto'

  return (
    <div>
      <button
        onClick={(e) => {
          console.log({ e })
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
          <div>Crear partoS</div>
          <AnimalBreedingOptions breedingId={breedingId} />
        </Modal>
      )}
    </div>
  )
}

export default ModalAnimalBreedingOptions
