import InputContainer, { SelectOption } from 'components/inputs/InputContainer'
import Modal from 'components/modal'
import { AnimalType } from 'firebase/types.model.ts/AnimalType.model'
import { useEffect, useState } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import GENDER_OPTIONS from 'components/CONSTANTS/GENDER_OPTIONS'
import { getFemaleOvines, getMaleOvines } from '@firebase/Animal/main'
import Icon from 'components/Icon'
import { IconName } from 'components/Icon/icons-list'

export const AnimalParentsForm = () => {
  const { setValue, watch } = useFormContext()
  // console.log(watch('parents'))
  const parents = watch('parents')
  return (
    <>
      <div className=" flex w-full justify-around">
        <div className="flex flex-col justify-center text-center">
          <span>Madre: </span>
          <span>{parents?.mother?.earring ?? 'sin'}</span>
        </div>
        <div className="flex flex-col justify-center text-center">
          <span>Padre: </span>
          <span>{parents?.father?.earring ?? 'sin'}</span>
        </div>
      </div>
      <div className="flex w-full justify-around my-2">
        <ParentForm
          gender="female"
          setValue={(value) => setValue(`parents.mother`, value)}
          value={parents?.mother}
        />
        <ParentForm
          gender="male"
          setValue={(value) => setValue(`parents.father`, value)}
          value={parents?.father}
        />
      </div>
    </>
  )
}

const ParentForm = ({
  gender,
  setValue,
  value
}: {
  gender: AnimalType['gender']
  setValue: (data: any) => void
  value: any
}) => {
  const methods = useForm({
    defaultValues: value
  })

  const { register, watch, handleSubmit, reset, unregister } = methods

  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }

  const { parentLabel, en_parent, icon } = GENDER_OPTIONS[gender]
  const isPartOfTheFarm = watch(`inTheFarm`)
  const [parents, setParents] = useState([])

  const formatParentsAsOptions = (parents: AnimalType[]): SelectOption[] => {
    return parents.map((animal) => {
      return { label: animal.earring, value: animal.earring, id: animal.id }
    })
  }

  useEffect(() => {
    if (isPartOfTheFarm === 'true') {
      unregister('breed')
      unregister('birthday')
      if (gender === 'female') {
        getFemaleOvines().then((res) => setParents(res))
      } else {
        getMaleOvines().then((res) => setParents(res))
      }
    }
  }, [isPartOfTheFarm])

  const onSubmit = (data) => {
    // console.log(data)
    setValue?.(data)
    setOpenModal(false)
  }

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
          <FormProvider {...methods}>
            <div className="flex justify-center">
              <span>Es parte de la granja:</span>
              <div className="w-36 flex justify-around">
                <label className="flex items-center">
                  <span className="mr-2">Si</span>
                  <input
                    type={'radio'}
                    {...register(`inTheFarm`)}
                    value="true"
                    checked={isPartOfTheFarm == 'true'}
                  />
                </label>

                <label className="flex items-center">
                  <span className="mr-2">No</span>
                  <input
                    type={'radio'}
                    {...register(`inTheFarm`)}
                    value="false"
                    checked={isPartOfTheFarm == 'false'}
                  />
                </label>
              </div>
            </div>

            {isPartOfTheFarm == 'true' && (
              <>
                <InputContainer
                  name={`earring`}
                  label="Arete"
                  type="select"
                  selectOptions={formatParentsAsOptions(parents)}
                />
              </>
            )}
            {isPartOfTheFarm == 'false' && (
              <>
                <InputContainer
                  name={`earring`}
                  label="Arete / Indentificador"
                  type="text"
                  rules={{ required: 'Este campo es necesario' }}
                />
                <InputContainer name={`breed`} label="Raza" type="text" />
                <InputContainer
                  name={`birthday`}
                  label="Nacimiento"
                  type="date"
                  rules={{ required: 'Selecciona una fecha' }}
                />
              </>
            )}
            <div className="flex w-full justify-evenly mt-4">
              <button
                className="btn btn-circle btn-sm btn-error"
                onClick={(e) => {
                  e.preventDefault()
                  reset()
                }}
              >
                <Icon name="close" />
              </button>
              <button
                className="btn btn-circle btn-sm btn-success"
                onClick={(e) => {
                  e.preventDefault()
                  handleSubmit(onSubmit)()
                }}
              >
                <Icon name="done" />
              </button>
            </div>
          </FormProvider>
        </div>
      </Modal>
    </>
  )
}

export default AnimalParentsForm
