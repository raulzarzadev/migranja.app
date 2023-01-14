import RevertBirthForm from '@comps/forms/RevertBirthForm'
import { SelectOption } from '@comps/inputs/InputContainer'
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

const AnimalBreedingOptions = ({
  animal,
  openModal,
  handleOpenModal
}: {
  animal: AnimalBreedingEventCard
  openModal: boolean
  handleOpenModal: () => void
}) => {
  const farmEvents = useSelector(selectFarmEvents)
  const farmAnimals = useSelector(selectFarmAnimals)
  const breedingAnimal = farmEvents
    .find(({ id }) => animal?.eventData?.id === id)
    ?.eventData.breedingBatch?.find(
      ({ earring }) => earring === animal?.earring
    )
  const birthEventData: BirthEventDataType | undefined =
    breedingAnimal?.birthEventData
  const breedingMale = animal.eventData?.breedingMale

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
    removeAnimalFromBreeding(animal.eventData.id, animal.id || '')
      .then((res) => {
        console.log(res)
      })
      .then((err) => console.log(err))
  }
  return (
    <Modal
      handleOpen={handleOpenModal}
      open={openModal}
      title="Opciones de monta "
    >
      <div>
        <div className="text-xs text-center">
          Monta:
          <span className="font-bold"> {animal?.eventData?.breedingId}</span>
        </div>
        <div className="text-xs flex justify-evenly w-full">
          <div>
            Macho:{' '}
            <span className="font-bold">
              {breedingMale?.earring}
              <span> {breedingMale?.name} </span>
            </span>
          </div>
          <div>
            Hembra:{' '}
            <span className="font-bold">
              {animal?.earring}
              <span> {animal?.name} </span>
            </span>
          </div>
        </div>
        {animal.status === 'BIRTH' && birthEventData && (
          <div>
            <div>Detalles de parto</div>
            <div>
              Evento
              <div className="text-center">{birthEventData.birthEventId}</div>
            </div>
            <div>
              Animales creados{' '}
              <div className="text-center">
                {birthEventData.newCalfsIds.map((animal, i) => (
                  <div key={animal}>
                    {farmAnimals.find(({ id }) => id === animal)?.earring ||
                      animal}
                  </div>
                ))}
              </div>
            </div>
            <div>
              Destetes programados{' '}
              <div className="text-center">
                {birthEventData.calfsWeaningsIds.map((weaning) => (
                  <div key={weaning}>{weaning}</div>
                ))}
              </div>
            </div>
          </div>
        )}
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
        {option === 'REVERT' && (
          <RevertBirthForm animal={animal} birthEventData={birthEventData} />
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
      </div>
    </Modal>
  )
}
export default AnimalBreedingOptions
