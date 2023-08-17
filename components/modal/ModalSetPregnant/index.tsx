import useModal from '@comps/hooks/useModal'
import Modal from '..'
import { AnimalType } from 'types/base/AnimalType.model'
import { FarmEvent } from 'types/base/FarmEvent.model'
import ProgressButton from '@comps/ProgressButton'
import useProgress from '@comps/hooks/useProgress'
import useEvent from '@comps/hooks/useEvent'
import ModalAnimalDetails from '../ModalAnimalDetails'

const ModalSetPregnant = ({
  motherId,
  breedingId
}: {
  motherId: AnimalType['id']
  breedingId: FarmEvent['id']
}) => {
  const modal = useModal()
  const { event } = useEvent({ eventId: breedingId })
  const male = event?.eventData.breedingMale
  const mother = event?.eventData.breedingBatch.find((a) => a.id === motherId)
  const handleSetPregnant = () => {
    console.log('set pregnant')
    console.log('evento', event)
    console.log('// update animal breeding state ')
    console.log('// update animal state ')
    console.log('// set animal pregnant ')
  }
  const { progress, setProgress } = useProgress()

  return (
    <div>
      <button
        onClick={(e) => {
          e.preventDefault()
          modal.handleOpen()
        }}
        className="btn btn-outline"
      >
        Gestante
      </button>
      <Modal {...modal} title="Confirmar gestante">
        <h4 className="text-center font-bold text-xl my-4">
          ¿Confirmar gesta?
        </h4>
        <p>
          Madre :{' '}
          <strong>
            <ModalAnimalDetails animalId={motherId} />
          </strong>
        </p>
        <section className="flex w-full justify-center my-4">
          <ProgressButton
            onClick={(e) => {
              e.preventDefault()
              handleSetPregnant()
            }}
            progress={progress}
            buttonLabel="Confirmar gesta"
          />
        </section>
      </Modal>
    </div>
  )
}

export default ModalSetPregnant
