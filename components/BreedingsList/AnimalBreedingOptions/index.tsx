import RevertBirthForm from '@comps/forms/RevertBirthForm'
import { SelectOption } from '@comps/inputs/InputContainer'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import { updateAnimalState } from '@firebase/Animal/main'
import { removeAnimalFromBreeding } from '@firebase/Events/main'
import Modal from 'components/modal'
import ModalDelete from 'components/modal/ModalDelete'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmEvents } from 'store/slices/farmSlice'
import { BirthEventDataType } from 'types/base/BirtEventDataType.model'
import { AnimalBreedingEventCard } from 'types/base/FarmEvent.model'
import AbortForm from './AbortForm'
import BirthForm from './BirthForm'
import EmptyPregnantForm from './EmptyPregnantForm'
import ModalRevertBirth from '@comps/modal/ModalRevertBirth'
import useAnimal from '@comps/hooks/useAnimal'
import useEvent from '@comps/hooks/useEvent'

const AnimalBreedingOptions = ({
  // animal,
  openModal,
  handleOpenModal,
  animalId,
  breedingId
}: {
  // animal: AnimalBreedingEventCard
  openModal: boolean
  handleOpenModal: () => void
  breedingId: string
  animalId: string
}) => {
  const farmEvents = useSelector(selectFarmEvents)
  // const farmAnimals = useSelector(selectFarmAnimals)
  const { animal } = useAnimal({ animalId })
  const { event } = useEvent({ eventId: breedingId })
  const breedingAnimal = farmEvents
    .find(({ id }) => animalId === id)
    ?.eventData.breedingBatch?.find(
      ({ earring }) => earring === animal?.earring
    )
  const birthEventData: BirthEventDataType | undefined =
    breedingAnimal?.birthEventData
  // const breedingMale = animal.eventData?.breedingMale

  const optionBirth: SelectOption = { label: 'Parto', value: 'BIRTH' }
  const optionAbort: SelectOption = { label: 'Aborto', value: 'ABORT' }
  const optionEmpty: SelectOption = { label: 'Vacio', value: 'EMPTY' }
  const optionDiscard: SelectOption = { label: 'Descartar', value: 'DISCARD' }
  const optionRevert: SelectOption = { label: 'Revertir', value: 'REVERT' }

  type OptionValue = 'PENDING' | 'BIRTH' | 'ABORT' | 'EMPTY'
  const OPTIONS_STATUS: Record<OptionValue, SelectOption[]> = {
    PENDING: [optionBirth, optionAbort, optionEmpty, optionDiscard],
    BIRTH: [optionRevert],
    ABORT: [optionRevert],
    EMPTY: [optionRevert]
  }

  const [option, setOption] = useState('')
  const handleRemove = () => {
    removeAnimalFromBreeding(breedingId, animalId || '')
      .then(async (res) => {
        console.log(res)
        //* * * * * * * * * * * * * * * * update (revert) animal state
        if (animalId)
          await updateAnimalState(
            animalId,
            animal?.pastState || 'FREE',
            animal?.state
          )
      })
      .then((err) => console.log(err))
  }

  console.log({ event })

  return (
    <>
      Form de opcions
      {/* <div>
        <div className="text-xs flex justify-evenly w-full">
          <div className="text-xs text-center">
            Monta:
            <span className="font-bold"> {animal?.eventData?.breedingId}</span>
          </div>
          <div>
            Hembra:{' '}
            <span className="font-bold">
              <ModalAnimalDetails earring={animal.earring} size="md" />
            </span>
          </div>
        </div>
        {animal.status !== 'BIRTH' && (
          <div className="flex justify-center my-2">
            <label className={`form-control `}>
              <span className="label-text">Opciones</span>
              <select
                onChange={({ target: { value } }) => setOption(value)}
                className="input input-bordered input-sm mx-auto w-[150px] "
              >
                <option value={''}>Selecciona </option>
                {OPTIONS_STATUS[animal.status as OptionValue].map(
                  ({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>
          </div>
        )}
        {animal.status === 'BIRTH' && birthEventData?.birthEventId && (
          <ModalRevertBirth
            birthId={birthEventData?.birthEventId}
            breedingId={animal.eventData.id}
            motherId={animal.id || ''}
          />
        )}
        {option === 'BIRTH' && (
          <BirthForm
            animal={{ ...animal, status: 'PENDING' }}
            possibleBirth={animal.eventData?.breedingDates?.birthStartAt}
          />
        )}
        {option === 'ABORT' && <AbortForm animal={animal} />}
        {option === 'EMPTY' && <EmptyPregnantForm animal={animal} />}
        {option === 'DISCARD' && (
          <div className="flex w-full justify-center my-6">
            <ModalDelete
              text={`Eliminar este animal de la monta de forma permanente ${
                animal.earring
              } ${animal.name || ''}`}
              title="Eliminar del la monta"
              buttonLabel={'Descartar'}
              handleDelete={() => handleRemove()}
            />
          </div>
        )}
      </div> */}
    </>
  )
}
export default AnimalBreedingOptions
