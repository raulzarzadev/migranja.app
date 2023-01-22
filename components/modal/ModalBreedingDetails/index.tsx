import { formatBreedingBatchesAnimalsWithBreedingData } from '@comps/BreedingsList'
import { BreedingCard } from '@comps/BreedingsList/BreedingsByBatches'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmEvents } from 'store/slices/farmSlice'
import {
  BreedingEventCardDetails,
  FarmBreedingEvent
} from 'types/base/FarmEvent.model'
import Modal from '..'

const ModalBreedingDetails = ({
  breedingBatchId
}: {
  breedingBatchId: string
}) => {
  const [openBreeding, setOpenBreeding] = useState(false)
  const handleOpenBreeding = () => {
    setOpenBreeding(!openBreeding)
  }
  const farmEvents = useSelector(selectFarmEvents)
  const breeding = farmEvents?.find(
    (event) =>
      event.eventData.breedingId === breedingBatchId &&
      event.type === 'BREEDING'
  )
  const breedingFormatted = formatBreedingBatchesAnimalsWithBreedingData([
    breeding as FarmBreedingEvent
  ])[0]
  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault()
          handleOpenBreeding()
        }}
        className="link text-sm underline-offset-4"
      >
        {breedingBatchId}
      </button>
      {breedingFormatted && (
        <Modal
          open={openBreeding}
          handleOpen={handleOpenBreeding}
          title="Breeding details"
        >
          <BreedingCard
            breeding={breedingFormatted as unknown as BreedingEventCardDetails}
          />
        </Modal>
      )}
    </>
  )
}

export default ModalBreedingDetails
