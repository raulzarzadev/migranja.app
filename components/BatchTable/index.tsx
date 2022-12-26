import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import AnimalsTable from 'components/AnimalsTable'

const BatchTable = ({ animals }: { animals: Partial<AnimalType>[] }) => {
  const handleSaveBatch = () => {}
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
      <AnimalsTable animalsData={animals || []} />
    </div>
  )
}

export default BatchTable
