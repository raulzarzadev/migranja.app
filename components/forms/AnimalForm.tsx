import Icon from 'components/Icon'
import InputContainer from 'components/inputs/InputContainer'
import { createAnimal, updateAnimal } from '@firebase/Animal/main'
import Image from 'next/image'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import AnimalParentsForm from './AnimalParentsForm'
import { FemaleOptions, MaleOptions } from 'components/CONSTANTS/GENDER_OPTIONS'
import { CreateAnimalDTO } from 'firebase/Animal/animal.model'

export const AnimalForm = ({
  animal,
  setEditing
}: {
  animal: CreateAnimalDTO
  setEditing?: (v: boolean) => void
}) => {
  const [loading, setLoading] = useState(false)
  const methods = useForm({
    defaultValues: {
      ...animal,
      birthday: new Date(),
      gender: 'female',
      birthType: '1',
      weight: {
        atBirth: null,
        atWeaning: null,
        at6Month: null,
        at12Month: null,
        ...animal.weight
      }
    }
  })
  const { watch, register, handleSubmit, reset } = methods
  const { id, parents, images } = watch()

  // console.log(watch())
  const onSubmit = (data: any) => {
    console.log(data)
    setLoading(true)
    if (id) {
      updateAnimal(id, data)
        .then((res: any) => console.log(res))
        .catch((err: any) => console.log(err))
        .finally(() => {
          setEditing?.(false)
          setLoading(false)
        })
    } else {
      createAnimal(data)
        .then((res: any) => console.log(res))
        .catch((err: any) => console.log(err))
        .finally(() => {
          {
            setEditing?.(false)
            setLoading(false)
          }
        })
    }
  }
  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full justify-end">
            <button
              className="text-success btn btn-ghost btn-circle btn-sm"
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
                <Icon size="sm" name="done" />
              )}
            </button>
            {setEditing && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setEditing?.(false)
                  reset()
                }}
                className="text-error btn btn-ghost btn-circle btn-sm"
              >
                <Icon size="sm" name="close" />
              </button>
            )}
          </div>
          <div>
            <header className="flex w-full justify-between">
              <div>
                Detalles de animal
                <div>
                  <div className="text-xs">
                    <span>id:</span> <span className="">{id}</span>
                  </div>
                </div>
              </div>
              <div className="text-right ">
                <InputContainer
                  name="earring"
                  type="text"
                  label="Arete"
                  rules={{ required: 'Este campo es necesario*', minLength: 3 }}
                />
                <InputContainer name="lote" type="text" label="Lote" />
              </div>
            </header>
            <main>
              <div className="flex w-full">
                <div className="w-1/2">
                  Nacimiento
                  <div>
                    <InputContainer type="date" name="birthday" label="Fecha" />
                    <InputContainer
                      label="Sexo"
                      type="select"
                      name="gender"
                      selectOptions={[MaleOptions, FemaleOptions]}
                    />

                    <InputContainer
                      label="Parto"
                      defaultValue="1"
                      type="select"
                      name="birthType"
                      selectOptions={[
                        { label: '1', value: 1 },
                        { label: '2', value: 2 },
                        { label: '3', value: 3 },
                        { label: '4', value: 4 }
                      ]}
                    />
                    {/* <span>{part}</span> */}
                  </div>
                </div>
                <div className="w-1/2 flex justify-center items-center">
                  <div className="w-full">
                    <figure className="border w-full aspect-video">
                      {images?.[0] ? (
                        <Image src={images[0].url} fill alt="animal-photo" />
                      ) : (
                        <></>
                      )}
                    </figure>
                  </div>
                </div>
              </div>
              <div>
                <div className="">
                  Genetica
                  <AnimalParentsForm />
                  <div className=" flex w-full justify-around">
                    <div className="flex flex-col justify-center text-center">
                      <span>Padre: </span>
                      <span>{parents?.father?.earring ?? 'sin'}</span>
                    </div>

                    <div className="flex flex-col justify-center text-center">
                      <span>Sexo: </span>
                      <span>{parents?.mother?.earring ?? 'sin'}</span>
                    </div>
                  </div>
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
