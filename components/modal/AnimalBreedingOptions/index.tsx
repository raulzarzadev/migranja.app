import ModalNewBirth from '../ModalNewBirth/indext'
import { AnimalType } from 'types/base/AnimalType.model'
import { EventType } from '@firebase/Events/event.model'
import { ReactNode } from 'react'
import ModalEmptyBirth from '../ModalEmptyBirth'
import ModalDiscardAnimal from './ModalDiscardAnimal'
import ModalSetPregnant from '../ModalSetPregnant'
import ModalBirthDetails from '../ModalBirthDetails'
import useEvent from '@comps/hooks/useEvent'
import BirthDetails from '@comps/BirthDetails'
import ModalRevertBirth from '../ModalRevertBirth'
import { is } from 'date-fns/locale'

const AnimalBreedingOptions = ({
  breedingId,
  motherId,
  isDead
}: {
  motherId: AnimalType['id']
  breedingId: EventType['id']
  children?: ReactNode
  isDead?: boolean
}) => {
  const { event } = useEvent({ eventId: breedingId })
  const animalEvent = event?.eventData.breedingBatch.find(
    (a) => a.id === motherId
  )

  const birthId = animalEvent?.birthEventData?.birthEventId
  if (isDead) {
    return <ModalDiscardAnimal motherId={motherId} breedingId={breedingId} />
  }
  if (animalEvent?.status === 'BIRTH')
    return (
      <div>
        <div>
          {birthId && (
            <>
              <BirthDetails birthId={birthId} />
              <ModalRevertBirth
                birthId={birthId}
                breedingId={breedingId || ''}
                motherId={motherId || ''}
              />
            </>
          )}
        </div>
      </div>
    )

  return (
    <div className="flex w-full justify-evenly">
      <ModalNewBirth
        motherId={motherId}
        breedingId={breedingId}
        isBreedingBirth
      />

      <ModalEmptyBirth motherId={motherId} breedingId={breedingId} />
      <ModalDiscardAnimal motherId={motherId} breedingId={breedingId} />
      <ModalSetPregnant motherId={motherId} breedingId={breedingId} />
    </div>
  )
}

export default AnimalBreedingOptions
