import ModalEditWeaning from '@comps/modal/ModalEditWeaning'
import { AnimalType } from 'types/base/AnimalType.model'

const AnimalsEventsOptions = ({
  animalsEarrings
}: {
  animalsEarrings: AnimalType['earring'][]
}) => {
  return (
    <div>
      <ModalEditWeaning eventId="" animalEarring="" />
    </div>
  )
}

export default AnimalsEventsOptions
