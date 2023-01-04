import { BreedingEventType } from '@firebase/Events/event.model'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { Merge } from '@firebase/types.model.ts/TypeBase.model'
import AnimalBreedingCard, {
  AnimalBreedingCardType
} from 'components/BreedingsList/AnimalBreedingCard'
import { formatAnimalsBreedings } from 'components/BreedingsList/breeding.helpers'
import { FarmEventType } from './FarmEvent/FarmEvent'
export interface FarmBirthEventType
  extends Merge<FarmEventType, BreedingEventType> {
  breedingBatch: AnimalType[]
  breedingMale: Pick<AnimalType, 'earring' | 'breed' | 'batch' | 'id' | 'name'>
}
const BreedingEventDetails = ({ event }: { event: FarmBirthEventType }) => {
  //const animal = formatAnimalsBreedings([event])[0]
  console.log(event)
  //...animal, breeding: event
  const breeding: AnimalBreedingCardType = {
    breedingDates: {
      birthStartAt: 0,
      birthFinishAt: 0,
      breedingStartAt: 0,
      breedingFinishAt: 0,
      birthStartInDays: 0,
      birthFinishInDays: 0
    }
  }
  return (
    <div className="">
      <AnimalBreedingCard animal={breeding} />
    </div>
  )
}

export default BreedingEventDetails
