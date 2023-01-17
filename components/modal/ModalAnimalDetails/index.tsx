import { AnimalDetails } from '@comps/AnimalCard'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import Modal from '..'

const ModalAnimalDetails = ({
  earring = ''
}: {
  earring?: AnimalType['earring']
}) => {
  const [openAnimalDetails, setOpenAnimalDetails] = useState(false)
  const [animal, setAnimal] = useState<AnimalType | undefined>(undefined)
  const farmAnimals = useSelector(selectFarmAnimals)
  const handleOpenAnimalDetails = () => {
    setOpenAnimalDetails(!openAnimalDetails)
    setAnimal(
      farmAnimals.find(
        (animal) => animal.earring === earring || animal.id === earring
      )
    )
  }
  return (
    <span>
      <button
        className="link mx-2 font-bold text-xl underline-offset-4"
        onClick={(e) => {
          e.preventDefault()
          handleOpenAnimalDetails()
        }}
      >
        {earring}
      </button>
      <Modal
        open={openAnimalDetails}
        handleOpen={handleOpenAnimalDetails}
        title={`Detalles de arete ${earring}`}
      >
        {animal && <AnimalDetails animal={animal} />}
      </Modal>
    </span>
  )
}

export default ModalAnimalDetails
