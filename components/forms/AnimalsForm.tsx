import Icon from 'components/Icon'
import InputContainer from 'components/inputs/InputContainer'
import { createAnimal, deleteAnimal, updateAnimal } from '@firebase/Animal/main'
import Image from 'next/image'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import AnimalParentsForm from './AnimalParentsForm'
import { FemaleOptions, MaleOptions } from 'components/CONSTANTS/GENDER_OPTIONS'
import { CreateAnimalDTO } from 'firebase/Animal/animal.model'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import ModalDelete from 'components/modal/ModalDelete'
import sheep_breeds from 'components/CONSTANTS/SHEEP_BREEDS'
import useFarm from 'components/hooks/useFarm'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import Loading from 'components/Loading'

const schema = yup
  .object()
  .shape({
    earring: yup
      .string()
      .required('Este campo es necesario*')
      .min(3, 'Al menos 3 letras')
  })
  .required()

interface QuickAnimal {
  name: string
  earring: string
  gender: AnimalType['gender']
}

export const AnimalsForm = ({
  animal,
  setEditing
}: {
  animal: CreateAnimalDTO
  setEditing?: (v: boolean) => void
}) => {
  const { currentFarm } = useFarm()

  const [loading, setLoading] = useState(false)

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      gender: 'female',
      name: '',
      ...animal
    }
  })
  const { watch, handleSubmit, reset, setValue, setError } = methods
  const { id, images } = watch()

  const [animals, setAnimals] = useState<QuickAnimal[]>([])
  const { register } = methods

  const earringAlreadyExist = (earring: string) => {
    return !![...(currentFarm?.animals || []), ...animals]?.find(
      (animal: AnimalType | QuickAnimal) => animal?.earring === earring
    )
  }
  const onAddItem = (data: any) => {
    if (earringAlreadyExist(data?.earring)) {
      setError('earring', { type: 'validate', message: 'Este arete ya existe' })
    } else {
      setAnimals([...animals, data])
      reset()
    }
  }

  const handleRemove = (index: number) => {
    const animalCopy = [...animals]
    animalCopy.splice(index, 1)
    setAnimals(animalCopy)
  }

  const handleSave = async () => {
    setLoading(true)
    const farmData = {
      id: currentFarm.id,
      name: currentFarm.name
    }
    try {
      const savingAnimals = animals.map(async (animal) => {
        return await createAnimal({ ...animal, farm: farmData }).then(
          ({ res }: any) => {
            //console.log(res)
            return { ...res, ...animal }
          }
        )
      })

      await Promise.all(savingAnimals)
      setAnimals([])

      //console.log(res)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onAddItem)}>
          <header className="flex w-full justify-between flex-col sm:flex-row "></header>
          <main className="">
            <table className="table table-compact mx-auto ">
              <thead>
                <tr>
                  <th>Arete</th>
                  <th>Nombre</th>
                  <th>Sexo</th>
                  <th>Ops</th>
                </tr>
              </thead>
              <tbody>
                {animals.map((animal, i) => (
                  <tr key={animal.earring}>
                    <td>{animal.earring}</td>
                    <td>{animal.name}</td>
                    <td>{animal.gender}</td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleRemove(i)
                        }}
                      >
                        <Icon name="delete" />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <InputContainer
                      name="earring"
                      type="text"
                      className="w-24"
                    />
                  </td>
                  <td>
                    <InputContainer name="name" type="text" className="w-24" />
                  </td>
                  <td>
                    <div className="flex flex-col sm:flex-row">
                      <span className="flex flex-col p-0.5">
                        Hembra
                        <input
                          type="radio"
                          {...register('gender')}
                          value="female"
                          checked
                        />
                      </span>
                      <span className="flex flex-col p-0.5">
                        Macho
                        <input
                          type="radio"
                          {...register('gender')}
                          value="male"
                        />
                      </span>
                    </div>
                  </td>
                  <td>
                    <button>
                      Add <Icon name="plus" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </main>
          <footer>
            <div className="flex justify-evenly my-2">
              <button
                className="btn btn-outline"
                onClick={(e) => {
                  e.preventDefault()
                  reset()
                  setAnimals([])
                }}
              >
                Limpiar
              </button>
              <button
                disabled={loading}
                className="btn btn-info"
                onClick={(e) => {
                  e.preventDefault()
                  handleSave()
                }}
              >
                Guardar todos{' '}
                <span className="ml-1">
                  {loading ? <Loading /> : <Icon name="close" />}
                </span>
              </button>
            </div>
          </footer>
        </form>
      </FormProvider>
    </div>
  )
}

const FormHeader = ({
  id,
  setEditing,
  reset,
  loading,
  title = 'Form title'
}: any) => {
  const handleDelete = () => {
    id &&
      deleteAnimal(id)
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
  }

  return (
    <div className="flex w-full justify-end">
      <div>
        <div className="text-center font-bold">Ingresar animales</div>
      </div>
      <div className="flex w-1/3 justify-between">
        <span>
          {id && (
            <ModalDelete
              handleDelete={handleDelete}
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
          {loading ? <Loading /> : <Icon size="sm" name="done" />}
        </button>
      </div>
    </div>
  )
}

export default AnimalsForm
