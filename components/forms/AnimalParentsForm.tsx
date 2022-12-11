import InputContainer, { SelectOption } from 'components/inputs/InputContainer'
import Modal from 'components/modal'
import { AnimalType } from 'firebase/types.model.ts/AnimalType.model'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import GENDER_OPTIONS from 'components/CONSTANTS/GENDER_OPTIONS'
import { getFemaleOvines, getMaleOvines } from '@firebase/Animal/main'
import Icon from 'components/Icon'
import { IconName } from 'components/Icon/icons-list'

export const AnimalParentsForm = () => {
  return (
    <div className="flex w-full justify-around my-2">
      <ParentForm gender="male" />
      <ParentForm gender="female" />
    </div>
  )
}

const ParentForm = ({ gender }: { gender: AnimalType['gender'] }) => {
  const { register, watch } = useFormContext()

  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }

  const { label, parentLabel, en_parent, icon } = GENDER_OPTIONS[gender]
  const isPartOfTheFarm = watch(`parents.${en_parent}.inTheFarm`)
  const [parents, setParents] = useState([])
  const formatParentsAsOptions = (parents: AnimalType[]): SelectOption[] => {
    return parents.map((animal) => {
      return { label: animal.earring, value: animal.earring }
    })
  }
  useEffect(() => {
    if (gender === 'female') {
      getFemaleOvines().then((res) => setParents(res))
    } else {
      getMaleOvines().then((res) => setParents(res))
    }
  }, [])
  return (
    <>
      <button
        className={`btn btn-sm w-1/2 ${
          gender === 'male' ? 'btn-info' : 'btn-accent'
        }`}
        onClick={(e) => {
          e.preventDefault()
          handleOpenModal()
        }}
      >
        <span className="flex">
          {parentLabel}{' '}
          <span className="ml-1">
            <Icon name={icon as IconName} size="2xs" />
          </span>
        </span>
      </button>
      <Modal
        title={parentLabel ?? ''}
        open={openModal}
        handleOpen={handleOpenModal}
      >
        <div>
          <div className="flex justify-center">
            <span>Es parte de la granja:</span>
            <div className="w-36 flex justify-around">
              <label className="flex items-center">
                <span className="mr-2">Si</span>
                <input
                  type={'radio'}
                  {...register(`parents.${en_parent}.inTheFarm`)}
                  value="true"
                />
              </label>

              <label className="flex items-center">
                <span className="mr-2">No</span>
                <input
                  type={'radio'}
                  {...register(`parents.${en_parent}.inTheFarm`)}
                  value="false"
                />
              </label>
            </div>
          </div>
          {/* <InputContainer
            label="Es parte de la granja"
            type={'checkbox'}
            name={'parents.father.inTheFarm'}
          /> */}
          {isPartOfTheFarm == 'true' && (
            <>
              <InputContainer
                name={`parents.${en_parent}.earring`}
                label="Arete"
                type="select"
                selectOptions={formatParentsAsOptions(parents)}
              />
            </>
          )}
          {isPartOfTheFarm == 'false' && (
            <>
              <InputContainer
                name={`parents.${en_parent}.earring`}
                label="Arete / Indentificador"
                type="text"
              />
              <InputContainer
                name={`parents.${en_parent}.breed`}
                label="Raza"
                type="text"
              />
              <InputContainer
                name={`parents.${en_parent}.birthday`}
                label="Nacimiento"
                type="date"
              />
            </>
          )}
        </div>
      </Modal>
    </>
  )
}

export default AnimalParentsForm
