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
      <div>
        <ModalAnimalDetails earring={earring} />
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
