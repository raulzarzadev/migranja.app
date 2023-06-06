import useAnimal from '@comps/hooks/useAnimal'
import useEvent from '@comps/hooks/useEvent'
import useRevertBirth from '@comps/hooks/useRevertBirth'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import ProgressButton from '@comps/ProgressButton'

const RevertBirthForm = ({
  birthEventId,
  breedingId,
  motherId
}: {
  birthEventId: string
  breedingId?: string
  motherId?: string
}) => {
  const { animal: mother } = useAnimal({ animalId: motherId })
  const { event: birthEvent } = useEvent({ eventId: birthEventId })
  const calfs = birthEvent?.eventData.calfs
  const { handleRevertBirth, progress } = useRevertBirth({
    birthId: birthEventId,
    breedingId,
    motherId
  })

  return (
    <div>
      <div>Revertir parto</div>
      <p>Al revertir un parto se eliminaran los siguientes elementos </p>
      <p className="text-center">
        1. Animales{' '}
        <span className="flex justify-center">
          {calfs?.map((calf) => (
            <span key={calf.earring}>
              <ModalAnimalDetails earring={calf.earring} size="sm" />
            </span>
          ))}{' '}
        </span>
      </p>

      <p className="text-center">2. Destetes</p>
      <p className="text-center">3. Parto</p>
      <p>Al revertir un parto se actualizaran los siguientes elementos </p>
      <p className="text-center">1. Monta</p>
      <div className="text-center">
        2. Estado de <ModalAnimalDetails earring={mother?.earring} size="md" />{' '}
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
