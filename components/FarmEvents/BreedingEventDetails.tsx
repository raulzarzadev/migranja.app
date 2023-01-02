import { BreedingEventType } from '@firebase/Events/event.model'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { Merge, TypeBase } from '@firebase/types.model.ts/TypeBase.model'
import BreedingBatchesList from 'components/BreedingBatchesList'
import BreedingEvent from 'components/BreedingEvent'
import AnimalBreedingCard, {
  AnimalBreedingCardType
} from 'components/BreedingsList/AnimalBreedingCard'
import { formatAnimalsBreedings } from 'components/BreedingsList/breeding.helpers'
import { FarmEventType } from './FarmEvent'
export interface FarmBirthEventType
  extends Merge<FarmEventType, BreedingEventType> {
  breedingBatch: AnimalType[]
  breedingBirths: AnimalType[]
  breedingEmpty: AnimalType[]
  breedingMale: Pick<AnimalType, 'earring' | 'breed' | 'batch' | 'id' | 'name'>
}
const BreedingEventDetails = ({ event }: { event: FarmBirthEventType }) => {
  const animal = formatAnimalsBreedings([event])[0]
  const breeding: AnimalBreedingCardType = { ...animal, breeding: event }
  return (
    <div className="">
      <AnimalBreedingCard animal={breeding} />
    </div>
  )
}

export default BreedingEventDetails
