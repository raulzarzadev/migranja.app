import RevertBirthForm from '@comps/forms/RevertBirthForm'
import { removeAnimalFromBreeding } from '@firebase/Events/main'
import Modal from 'components/modal'
import ModalDelete from 'components/modal/ModalDelete'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmEvents } from 'store/slices/farmSlice'
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

  const event = farmEvents
    .find(({ id }) => animal.eventData.id === id)
    ?.eventData.breedingBatch.find(({ earring }) => earring === animal.id)
  console.log({ event })

  const breedingMale = animal.eventData?.breedingMale

  const optionBirth = { label: 'Parto', value: 'BIRTH' }
  const optionAbort = { label: 'Aborto', value: 'ABORT' }
  const optionEmpty = { label: 'Vacio', value: 'EMPTY' }
  const optionDiscard = { label: 'Descartar', value: 'DISCARD' }
  const optionRevert = { label: 'Revertir', value: 'REVERT' }

  const OPTIONS_STATUS = {
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
  // console.log({ animal })

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
        <div className="flex justify-center my-2">
          <label className={`form-control `}>
            <span className="label-text">Opciones</span>
            <select
              onChange={({ target: { value } }) => setOption(value)}
              className="input input-bordered input-sm mx-auto w-[150px] "
            >
              <option value={''}>Selecciona </option>
              {OPTIONS_STATUS[animal.status || 'PENDING'].map(
                ({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                )
              )}
            </select>
          </label>
        </div>
        {option === 'REVERT' && <RevertBirthForm />}
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
