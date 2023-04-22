import { useSelector } from 'react-redux'
import {
  BreedingEventCardDetails,
  FarmBreedingEvent,
  FarmEvent
} from 'types/base/FarmEvent.model'
import { BreedingCard } from './BreedingsList/BreedingsByBatches'
import { formatBreedingBatchesAnimalsWithBreedingData } from './BreedingsList'
import { selectFarmEvents } from 'store/slices/farmSlice'

const BreedingDetails = ({ breedingId }: { breedingId: FarmEvent['id'] }) => {
  const farmEvents = useSelector(selectFarmEvents)

  const breeding = farmEvents?.find(
    (event) =>
      //* Should verify if this is a id breeding valid
      //event.eventData.breedingId === breedingBatchId &&
      (event.id === breedingId || event.eventData.breedingId === breedingId) &&
      event.type === 'BREEDING'
  )
  const breedingFormatted = formatBreedingBatchesAnimalsWithBreedingData([
    breeding as FarmBreedingEvent
  ])[0]
  console.log({ breedingFormatted })
  if (!breedingFormatted) {
    console.log('error formatting breedig')
    return <></>
  }

  return (
    <div>
      <BreedingCard
        // hiddenConfig
        hiddenBirths
        breeding={breedingFormatted as unknown as BreedingEventCardDetails}
      />
    </div>
  )
}

export default BreedingDetails
