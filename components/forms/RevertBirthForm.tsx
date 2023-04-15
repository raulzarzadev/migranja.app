import useRevertBirth from '@comps/hooks/useRevertBirth'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import ProgressButton from '@comps/ProgressButton'

import { BirthEventDataType } from 'types/base/BirtEventDataType.model'

const RevertBirthForm = ({
  animal,
  birthEventData,
  birthEventId,
  breedingId,
  motherId
}: {
  animal?: any
  birthEventData?: BirthEventDataType
  birthEventId: string
  breedingId: string
  motherId: string
}) => {
  //console.log({ birthEventData })
  // const handleRevertBreedingToPending = async () => {
  //   await updateAnimalStatusInBreedingBatch({
  //     eventId: animal.eventData.id,
  //     eventType: 'PENDING',
  //     animalId: animal.id
  //   })
  // }
  // const [progress, setProgress] = useState(0)
  // if (!birthEventData)
  //   return (
  //     <div>
  //       Al revertir esta parto, solo actualizas el evento monta. Deveras
  //       eliminar manualmente los eventos relacionados a este.
  //       <p>Destetes</p>
  //       <p>Animales </p>
  //       <button
  //         className="btn btn-error btn-outline "
  //         onClick={(e) => {
  //           e.preventDefault()
  //           handleRevertBreedingToPending()
  //         }}
  //       >
  //         Revertir
  //       </button>
  //     </div>
  //   )
  // console.log({ birthEventData })
  // const handleRevertBirth = async () => {
  //   setProgress(10)
  //   // ************************* delete birth event
  //   await deleteEvent(birthEventData?.birthEventId)
  //   // ************************* delete animals weaning
  //   for (let i = 0; i < birthEventData.calfsWeaningsIds.length; i++) {
  //     const weaningId = birthEventData.calfsWeaningsIds[i]
  //     await deleteEvent(weaningId)
  //     setProgress(30 * (i / birthEventData.calfsWeaningsIds.length))
  //   }
  //   // ************************* delete animals
  //   for (let i = 0; i < birthEventData.newCalfsIds.length; i++) {
  //     const calfId = birthEventData.newCalfsIds[i]
  //     await deleteAnimal(calfId)
  //     setProgress(70 * (i / birthEventData.newCalfsIds.length))
  //   }
  //   console.log({
  //     eventId: birthEventData.birthEventId,
  //     eventType: 'PENDING',
  //     animalId: animal.id
  //   }) // ************************* update breeding to pending
  //   await updateAnimalStatusInBreedingBatch({
  //     eventId: animal.eventData.id,
  //     eventType: 'PENDING',
  //     animalId: animal.id
  //   })
  //   // ************************* update mom to breeding
  //   await updateAnimal(animal.id, { state: 'FREE' })

  //   setProgress(100)
  // }

  const { handleRevertBirth, progress } = useRevertBirth({
    birthId: birthEventId,
    breedingId,
    motherId
  })

  return (
    <div>
      <div>Revertir parto</div>
      <p>Al revertir un parto se eliminaran los siguientes elementos </p>
      <p className="text-center">1. Animales</p>

      <p className="text-center">2. Destetes</p>
      <p className="text-center">3. Parto</p>
      <p>Al revertir un parto se actualizaran los siguientes elementos </p>
      <p className="text-center">1. Monta</p>
      <div className="text-center">
        2. Estado de <ModalAnimalDetails earring={animal?.earring} size="md" />{' '}
        a libre{' '}
      </div>
      <div className="text-center">
        <ProgressButton
          progress={progress}
          buttonLabel="Revertir"
          className="btn-error btn-outline"
          onClick={() => {
            handleRevertBirth()
          }}
        />
      </div>
    </div>
  )
}

export default RevertBirthForm
