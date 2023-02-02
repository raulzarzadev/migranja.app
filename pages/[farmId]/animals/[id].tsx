import AnimalCard from '@comps/AnimalCard'
import { useRouter } from 'next/router'

const Animal = () => {
  const {
    query: { id: animalId }
  } = useRouter()
  return (
    <div className="flex justify-center w-full items-center my-4">
      <div className="max-w-md bg-base-300 rounded-lg shadow-md p-4">
        {/* <AnimalCard animalId={animalId as string} /> */}
      </div>
    </div>
  )
}

export default Animal
