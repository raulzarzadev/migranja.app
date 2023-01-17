import { AnimalDetails } from '@comps/AnimalCard'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import Modal from '..'

const ModalAnimalDetails = ({
  earring
}: {
  earring: AnimalType['earring']
}) => {
  const [openAnimalDetails, setOpenAnimalDetails] = useState(false)
  const [animal, setAnimal] = useState<AnimalType | undefined>(undefined)
  const farmAnimals = useSelector(selectFarmAnimals)
  const handleOpenAnimalDetails = () => {
    setOpenAnimalDetails(!openAnimalDetails)
    setAnimal(farmAnimals.find((animal) => animal.earring === earring))
  }
  return (
    <div>
      <button
        className="link"
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
    </div>
  )
}

export default ModalAnimalDetails
