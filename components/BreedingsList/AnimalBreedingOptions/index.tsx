import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import Modal from 'components/modal'
import { useState } from 'react'
import BirthForm from './BirthForm'

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
    }
  ]
  const [option, setOption] = useState('')
  return (
    <Modal
      handleOpen={handleOpenModal}
      open={openModal}
      title="Opciones de monta "
    >
      <div>
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
      </div>
    </Modal>
  )
}
export default AnimalBreedingOptions
