import Icon from 'components/Icon'
import InputContainer from 'components/inputs/InputContainer'
import { createAnimal, updateAnimal } from '@firebase/Animal/main'
import Image from 'next/image'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import AnimalParentsForm from './AnimalParentsForm'
import { FemaleOptions, MaleOptions } from 'components/CONSTANTS/GENDER_OPTIONS'
import { CreateAnimalDTO } from 'firebase/Animal/animal.model'

import ModalDelete from 'components/modal/ModalDelete'
import sheep_breeds from 'components/CONSTANTS/SHEEP_BREEDS'
import useAnimal from 'components/hooks/useAnimal'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useSelector } from 'react-redux'
import { selectFarmState } from 'store/slices/farmSlice'
import { AnimalState } from 'types/base/AnimalState.model'
import { AnimalType } from 'types/base/AnimalType.model'
import useEarringAlreadyExist from '@comps/hooks/useEarringAlreadyExist'
import ImagesDisplay from '@comps/ImagesDisplay'
import { ImageType } from 'types/base/ImageType.model'

const schema = yup
  .object()
  .shape({
    earring: yup
      .string()
      .required('Este campo es necesario*')
      .min(3, 'Al menos 3 letras')
  })
  .required()

export const AnimalForm = ({
  animal,
  setEditing,
  checkFarmEarrings
}: {
  animal?: CreateAnimalDTO
  checkFarmEarrings?: boolean
  setEditing?: (v: boolean) => void
}) => {
  const currentFarm = useSelector(selectFarmState)
  const { checkIfExist, ModalAlreadyExist } = useEarringAlreadyExist()
  const farmData = {
    id: currentFarm?.id,
    name: currentFarm?.name
  }

  const [loading, setLoading] = useState(false)
  const defaultValues: Partial<AnimalType> = {
    state: 'FREE',
    birthday: new Date(),
    gender: 'female',
    joinedAt: new Date(),
    breed: '',
    name: '',
    birthType: 1,
    isStallion: false,
    currentStatus: 'ACTIVE',
    batch: null,
    ...animal,
    weight: {
      atBirth: null,
      atWeaning: null,
      at6Month: null,
      at12Month: null,
      ...animal?.weight
    }
  }
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues
  })
  const { watch, handleSubmit, reset, setValue } = methods
  const formValues = watch()
  const { id, images } = formValues
  interface ErrorType {
    type: any
    message: string
  }
  const [error, setError] = useState<ErrorType | null>()

  const onSubmit = (data: any) => {
    setLoading(true)

    //* if checkFarmEarrings is true so check if this earring exist (active or inactive ) and if do, so show an alert and avoid created
    if (checkFarmEarrings && checkIfExist(data.earring)) {
      setError({ type: 'alreadyExist', message: '' })
      setLoading(false)
      return
    }

    if (id) {
      updateAnimal(id, data)
        .then((res: any) => {
          setEditing?.(false)
          console.log(res)
        })
        .catch((err: any) => {
          setError({ type: err, message: 'Hubo un error' })
          setTimeout(() => {
            setError(null)
          }, 1000)
        })
        .finally(() => {
          //setEditing?.(false)
          setLoading(false)
        })
    } else {
      createAnimal({ ...data, farm: farmData })
        .then(({ res }: any) => {
          // @ts-ignore FIXME: circularly references itself
          setValue('id', res?.id)
          setEditing?.(false)
          console.log(res)
        })
        .catch((err: any) => console.log(err))
        .finally(() => {
          {
            setEditing?.(false)
            setLoading(false)
          }
        })
    }
  }
  const animalStateOptions = Object.entries(AnimalState).map(([key, value]) => {
    return { label: value, value: key }
  })

  const handleSetImages = (images: string[]) => {
    const auxImages: ImageType[] = images.map((image) => ({
      url: image,
      metadata: ''
    }))
    if (id)
      updateAnimal(id, { images: auxImages })
        .then((res) => console.log({ res }))
        .catch((err) => console.log({ err }))
  }

  const { handleDelete } = useAnimal()
  // useDebugInformation('AnimalForm', { animal })
  return (
    <div>
      <h2 className="text-xl font-bold text-center">
        {id ? 'Editar animal' : 'Nuevo animal'}
      </h2>
      <>{ModalAlreadyExist}</>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full justify-end">
            <div className="flex w-1/3 justify-between">
              <span>
                {id && (
                  <ModalDelete
                    handleDelete={() => handleDelete(id)}
                    title={'Eliminar animal'}
                    buttonLabel={null}
                    openButtonProps={{
                      className: ' btn btn-error btn-circle btn-sm text-'
                    }}
                  />
                )}
              </span>

              <span>
                {setEditing && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      setEditing?.(false)
                      reset()
                    }}
                    className=" btn btn-info btn-circle btn-sm"
                  >
                    <Icon size="sm" name="close" />
                  </button>
                )}
              </span>

              <button
                className=" btn btn-success btn-circle btn-sm "
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="mr-4 w-6 h-6 text-base-content animate-spin dark:text-base-content fill-base-300"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <>
                    <Icon size="sm" name="save" />
                  </>
                )}
              </button>
            </div>
            {error && error.message}
          </div>
          <div>
            <header className="flex w-full justify-between flex-col">
              <h3>{`Detalles de animal`}</h3>
              {id && (
                <div className="text-xs">
                  <span>id:</span> <span className="">{id}</span>
                </div>
              )}
              <div>
                <div className="text-right flex flex-wrap justify-between">
                  <div className="w-[100px]">
                    <InputContainer
                      name="earring"
                      type="text"
                      label="Arete"
                      rules={{
                        validate: (val) => {
                          console.log({ val })
                          return false
                        }
                      }}
                    />
                  </div>
                  <div className="w-[100px]">
                    <InputContainer name="name" type="text" label="Nombre" />
                  </div>
                  <div className="w-[100px]">
                    <InputContainer name="batch" type="text" label="Lote" />
                  </div>
                </div>
                <div className="flex  justify-between flex-wrap text-end">
                  <InputContainer
                    label="Parto"
                    type="select"
                    name="birthType"
                    selectOptions={[
                      { label: '1', value: 1 },
                      { label: '2', value: 2 },
                      { label: '3', value: 3 },
                      { label: '4', value: 4 }
                    ]}
                  />
                  <InputContainer
                    label="Status"
                    type="select"
                    name="state"
                    selectOptions={animalStateOptions}
                  />
                  <InputContainer
                    label="Raza"
                    type="select"
                    name="breed"
                    selectOptions={sheep_breeds}
                  />
                </div>
              </div>
            </header>
            <main>
              <div>
                <InputContainer
                  label="Sexo"
                  type="select"
                  name="gender"
                  selectOptions={[MaleOptions, FemaleOptions]}
                />
                {formValues.gender === 'male' && (
                  <div className="w-[140px] my-2 flex items-end justify-center mx-auto">
                    <label className="flex items-center">
                      <span className="mr-1">Es un semental </span>
                      <input
                        className="checkbox "
                        type="checkbox"
                        {...methods.register('isStallion')}
                      />
                    </label>
                  </div>
                )}

                <InputContainer
                  type="date"
                  name="birthday"
                  label="Nacimiento"
                />
                <InputContainer
                  type="date"
                  name="joinedAt"
                  label="Incorporación"
                />
                {id && (
                  <ImagesDisplay
                    images={images?.map((image) => image.url) || []}
                    setImages={handleSetImages}
                  />
                )}
                {/* <span>{part}</span> */}
              </div>
              <div>
                <div className="">
                  Genetica
                  <AnimalParentsForm />
                </div>
                <div className="">
                  Peso
                  <div className=" flex w-full justify-around">
                    <div className="flex flex-col justify-center text-center">
                      <span>Al nacer: </span>
                      <span className="w-[80px]">
                        <InputContainer name="weight.atBirth" type="number" />
                      </span>
                    </div>
                    <div className="flex flex-col justify-center text-center">
                      <span>Al destete: </span>
                      <span className="w-[80px]">
                        <InputContainer name="weight.atWeaning" type="number" />
                      </span>
                    </div>
                    <div className="flex flex-col justify-center text-center">
                      <span>A los 6m: </span>
                      <span className="w-[80px]">
                        <InputContainer name="weight.at6Month" type="number" />
                      </span>
                    </div>
                    <div className="flex flex-col justify-center text-center">
                      <span>A los 12m: </span>
                      <span className="w-[80px]">
                        <InputContainer name="weight.at12Month" type="number" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default AnimalForm
