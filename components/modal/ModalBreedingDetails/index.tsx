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
import BreedingDetails from '@comps/BreedingDetails'
import useModal from '@comps/hooks/useModal'

const ModalBreedingDetails = ({
  breedingBatchId
}: {
  breedingBatchId: string
}) => {
  const modal = useModal()
  // const [openBreeding, setOpenBreeding] = useState(false)
  // const handleOpenBreeding = () => {
  //   setOpenBreeding(!openBreeding)
  // }
  // const farmEvents = useSelector(selectFarmEvents)
  // const breeding = farmEvents?.find(
  //   (event) =>
  //     event.eventData.breedingId === breedingBatchId &&
  //     event.type === 'BREEDING'
  // )
  // const breedingFormatted = formatBreedingBatchesAnimalsWithBreedingData([
  //   breeding as FarmBreedingEvent
  // ])[0]

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault()
          modal.handleOpen()
        }}
        className="link text-sm underline-offset-4 font-bold mx-2"
      >
        {breedingBatchId}
      </button>
      {modal.open && (
        <Modal {...modal} title="Detalles de monta">
          <BreedingDetails breedingId={breedingBatchId} />
          {/* <BreedingCard
            // hiddenConfig
            hiddenBirths
            breeding={breedingFormatted as unknown as BreedingEventCardDetails}
          /> */}
        </Modal>
      )}
    </>
  )
}

export default ModalBreedingDetails
