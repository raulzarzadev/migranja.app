import {
  getFarmFemaleOvines,
  getFarmMaleOvines,
  getFemaleOvines,
  getMaleOvines
} from '@firebase/Animal/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import GENDER_OPTIONS from 'components/CONSTANTS/GENDER_OPTIONS'
import Icon from 'components/Icon'
import { IconName } from 'components/Icon/icons-list'
import InputContainer, { SelectOption } from 'components/inputs/InputContainer'
import Modal from 'components/modal'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

export const ParentForm = ({
  gender,
  setValue,
  value,
  farmId
}: {
  gender: AnimalType['gender']
  setValue: (data: any) => void
  value: any
  farmId: string
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
  const [parents, setParents] = useState<AnimalType[]>([])

  const formatParentsAsOptions = (parents: AnimalType[]): SelectOption[] => {
    return parents.map((animal) => {
      return { label: animal.earring, value: animal.earring, id: animal.id }
    })
  }

  useEffect(() => {
    if (isPartOfTheFarm === 'true' && farmId) {
      unregister('breed')
      unregister('birthday')
      if (gender === 'female') {
        getFarmFemaleOvines(farmId).then((res: AnimalType[]) => setParents(res))
      } else {
        getFarmMaleOvines(farmId)
          .then((res: AnimalType[]) => setParents(res))
          .catch((err) => console.log(err))
      }
    }
  }, [gender, isPartOfTheFarm, unregister, farmId])

  const onSubmit = (data: any) => {
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
