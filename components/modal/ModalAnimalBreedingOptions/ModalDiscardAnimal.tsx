import useModal from '@comps/hooks/useModal'
import Modal from '..'
import { discardAnimalFromBreedingBatch } from '@firebase/Events/main'

const ModalDiscardAnimal = ({ motherId, breedingId }) => {
  const modal = useModal()
  const handleDiscardFemaleFromBreeding = async (motherId, breedingId) => {
    try {
      const res = await discardAnimalFromBreedingBatch({
        animalId: motherId,
        eventId: breedingId
      })
      // console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <button
        className="btn btn-outline btn-primary "
        onClick={(e) => {
          e.preventDefault()
        }}
      >
        Descartar
      </button>
      <Modal {...modal} title="Descartar animal de monta">
        <h2>Descartar animal de la monta </h2>
        <div className="flex w-full justify-around">
          <button className="btn btn-outline ">Cancelar</button>
          <button
            className="btn btn-outline btn-info"
            onClick={(e) => {
              e.preventDefault()
              handleDiscardFemaleFromBreeding(motherId, breedingId)
            }}
          >
            Descartar
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default ModalDiscardAnimal
