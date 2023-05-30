import Modal from '@comps/modal'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import { AnimalType } from 'types/base/AnimalType.model'

const useEarringAlreadyExist = () => {
  const farmAnimals = useSelector(selectFarmAnimals)
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }

  const [earring, setEarring] = useState('')
  const ModalAlreadyExist = (
    <Modal
      handleOpen={handleOpenModal}
      open={openModal}
      title="Este arete ya existe"
    >
      <div className="text-center">
        <p className="my-4">
          <ModalAnimalDetails earring={earring} />
        </p>
        {/* <div className="flex w-full justify-evenly">
          <button
            className="btn btn-outline"
            onClick={(e) => {
              e.preventDefault()
              handleOpenModal()
            }}
          >
            Cancelar
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
            }}
            className="btn btn-error"
          >
            Ignorar*
          </button>
        </div> */}
        <p className="text-sm my-2">
          *Ingonrar esta advertencia podria traer problemas al tener dos
          animales con el mismo numero de arete
        </p>
      </div>
    </Modal>
  )

  /**
   *
   * @param earring should be a AnimaType['earring']
   * @returns
   */

  const checkIfExist = (earring: AnimalType['earring']) => {
    setEarring(earring)
    const alreadyExist = farmAnimals.find(
      (animal) => animal.earring === earring
    )
    if (alreadyExist) {
      setOpenModal(true)
      return true
    }
    return false
  }

  return { checkIfExist, ModalAlreadyExist }
}

export default useEarringAlreadyExist
