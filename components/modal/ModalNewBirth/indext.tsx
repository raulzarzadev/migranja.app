import useModal from '@comps/hooks/useModal'
import Modal from '..'
import BirthForm from '@comps/BreedingsList/AnimalBreedingOptions/BirthForm copy'
import useAnimal from '@comps/hooks/useAnimal'
import useEvent from '@comps/hooks/useEvent'
import useBreedingDates from '@comps/hooks/useBreedingDates'
import { OtherBreedingMale } from 'types/base/FarmEvent.model'

const ModalNewBirth = ({
  motherId,
  breedingId
}: {
  motherId: string
  breedingId: string
}) => {
  const modal = useModal()

  const { animal: motherDetails } = useAnimal({ animalId: motherId })
  const { event } = useEvent({ eventId: breedingId })
  const { breedingDates } = useBreedingDates({ breedingId })
  const animal = { ...motherDetails, eventData: event?.eventData }
  const breedingMale = event?.eventData.breedingMale

  const sortByStartAt = (a: any, b: any) => a.startAt - b.finishAt
  const breedingMales: OtherBreedingMale[] = [
    {
      earring: breedingMale?.earring || '',
      finishAt: event?.eventData?.finishAt || '',
      startAt: event?.eventData?.startAt || '',
      breed: breedingMale?.breed || '',
      id: breedingMale?.id || '',
      name: breedingMale?.name || ''
    },
    ...(event?.eventData?.otherMales || []).sort(sortByStartAt)
  ]
  return (
    <div>
      <button
        className="btn btn-outline btn-info"
        onClick={(e) => {
          modal.handleOpen()
        }}
      >
        Parto
      </button>
      <Modal {...modal} title="Nuevo parto">
        <BirthForm
          animal={animal}
          possibleBirth={breedingDates.birthStartAt}
          breedingId={event?.id}
        />
      </Modal>
    </div>
  )
}

export default ModalNewBirth
