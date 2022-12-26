import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import AnimalsTable from 'components/AnimalsTable'
import AnimalForm from 'components/forms/AnimalForm'
import Modal from 'components/modal'
import { useState } from 'react'

const BatchTable = ({ animals }: { animals: Partial<AnimalType>[] }) => {
  const handleSaveBatch = () => {}
  const [animalSelected, setAnimalSelected] =
    useState<Partial<AnimalType | null>>(null)
  const handleOpenAnimal = ({ id, earring }: any) => {
    handleOpenAnimalForm()
    const animal = animals?.find((animal) => animal.earring === earring)
    console.log(animal)
    setAnimalSelected(animal)
  }
  const [openAnimalForm, setOpenAnimalForm] = useState(false)
  const handleOpenAnimalForm = () => {
    setOpenAnimalForm(!openAnimalForm)
  }
  return (
    <div>
      <div className="flex w-full justify-center mt-4">
        <button
          className="btn my-2 btn-info"
          onClick={(e) => {
            e.preventDefault()
            handleSaveBatch()
          }}
        >
          Guardar lote
        </button>
      </div>
      <Modal
        title="Detalles"
        open={openAnimalForm}
        handleOpen={handleOpenAnimalForm}
      >
        <div>{animalSelected && <AnimalForm animal={animalSelected} />}</div>
      </Modal>
      <AnimalsTable animalsData={animals || []} onRowClick={handleOpenAnimal} />
    </div>
  )
}

export default BatchTable
