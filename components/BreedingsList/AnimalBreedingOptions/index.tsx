import { removeAnimalFromBreeding } from '@firebase/Events/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import Modal from 'components/modal'
import ModalDelete from 'components/modal/ModalDelete'
import { useState } from 'react'
import AbortForm from './AbortForm'
import BirthForm from './BirthForm'
import EmptyPregnantForm from './EmptyPregnantForm'

const AnimalBreedingOptions = ({
  animal,
  openModal,
  handleOpenModal
}: {
  animal: Partial<AnimalType>
  openModal: boolean
  handleOpenModal: () => void
}) => {
  const options = [
    {
      label: 'Parto',
      value: 'birth'
    },
    {
      label: 'Aborto',
      value: 'abort'
    },
    {
      label: 'No preña',
      value: 'notPregnant'
    },
    {
      label: 'Descartar',
      value: 'discard'
    }
  ]
  const [option, setOption] = useState('')
  const handleRemove = () => {
    removeAnimalFromBreeding(animal.breeding.id, animal.id || '')
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
          Monta:<span className="font-bold"> {animal?.breeding?.batch}</span>
        </div>
        <div className="text-xs flex justify-evenly w-full">
          <div>
            Macho:{' '}
            <span className="font-bold">
              {animal?.breeding?.breedingMale?.earring}
              <span> {animal?.breeding?.breedingMale?.name} </span>
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
              {options.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {option === 'birth' && <BirthForm animal={animal} />}
        {option === 'abort' && <AbortForm animal={animal} />}
        {option === 'notPregnant' && <EmptyPregnantForm animal={animal} />}
        {option === 'discard' && (
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
