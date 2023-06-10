import useModal from '@comps/hooks/useModal'
import Modal from '..'
import ModalNewBirth from '../ModalNewBirth/indext'
import { AnimalType } from 'types/base/AnimalType.model'
import { EventType } from '@firebase/Events/event.model'
import { ReactNode } from 'react'
import ModalEmptyBirth from '../ModalEmptyBirth'
import {
  discardAnimalFromBreedingBatch,
  updateEventBreedingBatch
} from '@firebase/Events/main'

const ModalAnimalBreedingOptions = ({
  children,
  breedingId,
  motherId
}: {
  motherId: AnimalType['id']
  breedingId: EventType['id']
  children: ReactNode
}) => {
  const modal = useModal()
  const defaultButton = 'Detalles de parto'
  const handleDiscardFemaleFromBreeding = async (motherId, breedingId) => {
    try {
      const res = await discardAnimalFromBreedingBatch({
        animalId: motherId,
        eventId: breedingId
      })
      // console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <button
        onClick={(e) => {
          //console.log({ e })
          modal.handleOpen()
        }}
        className="w-full"
      >
        {children || defaultButton}
      </button>
      {modal.open && (
        <Modal
          open={modal.open}
          handleOpen={modal.handleOpen}
          title="Detalles de monta individual"
        >
          <div className="flex w-full justify-evenly">
            <ModalNewBirth
              motherId={motherId}
              breedingId={breedingId}
              isBreedingBirth
            />

            <ModalEmptyBirth motherId={motherId} breedingId={breedingId} />
            <button
              className="btn btn-outline btn-primary "
              onClick={(e) => {
                e.preventDefault()
                handleDiscardFemaleFromBreeding(motherId, breedingId)
              }}
            >
              Descartar
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ModalAnimalBreedingOptions
