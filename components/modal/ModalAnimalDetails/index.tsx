import { AnimalDetails } from '@comps/AnimalCard'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import Modal from '..'

const ModalAnimalDetails = ({
  earring = '',
  size = 'lg'
}: {
  size?: 'lg' | 'md' | 'sm'
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
  const sizing = {
    sm: 'text-xs',
    md: 'text-md',
    lg: 'text-xl'
  }
  return (
    <span>
      <span
        className={`link mx-2 font-bold  underline-offset-4 ${sizing[size]}`}
        onClick={(e) => {
          e.preventDefault()
          handleOpenAnimalDetails()
        }}
      >
        {earring}
      </span>
      {openAnimalDetails && (
        <Modal
          open={openAnimalDetails}
          handleOpen={handleOpenAnimalDetails}
          title={`Detalles de arete ${earring}`}
        >
          {animal && <AnimalDetails animal={animal} />}
        </Modal>
      )}
    </span>
  )
}

export default ModalAnimalDetails
