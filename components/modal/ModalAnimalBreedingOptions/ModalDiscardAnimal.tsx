import useModal from '@comps/hooks/useModal'
import Modal from '..'
import { removeAnimalFromBreeding } from '@firebase/Events/main'

const ModalDiscardAnimal = ({
  motherId,
  breedingId
}: {
  motherId: string
  breedingId: string
}) => {
  const modal = useModal()
  const handleDiscardFemaleFromBreeding = async (
    motherId: string,
    breedingId: string
  ) => {
    try {
      const res = await removeAnimalFromBreeding(breedingId, motherId)
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
          modal.handleOpen()
        }}
      >
        Descartar
      </button>
      <Modal {...modal} title="Descartar animal de monta">
        <h2 className="text-center my-4">Descartar animal de la monta </h2>
        <div className="flex w-full justify-around">
          <button
            className="btn btn-outline "
            onClick={(e) => {
              e.preventDefault()
              modal.handleOpen()
            }}
          >
            Cancelar
          </button>
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
