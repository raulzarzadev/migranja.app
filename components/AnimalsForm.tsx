import { useState } from 'react'
import Icon from './Icon'
import InputContainer from './inputs/InputContainer'
import { FormProvider, useForm } from 'react-hook-form'
import { AnimalType } from 'types/base/AnimalType.model'
export interface NewAnimal {
  earring?: AnimalType['earring']
  gender?: 'male' | 'female'
  id?: AnimalType['id']
  weight: number
}

const AnimalsForm = ({
  isBirth,
  setAnimals
}: {
  isBirth: boolean
  setAnimals?: (animals: NewAnimal[]) => void
}) => {
  const [_animals, _setAnimals] = useState<NewAnimal[]>([])
  const methods = useForm()
  const handleRemove = (index: number) => {
    const aux = [..._animals]
    aux.splice(index, 1)
    setAnimals?.(aux)
    _setAnimals(aux)
  }
  const onSubmit = (data: any) => {
    const animals = [..._animals, data]
    _setAnimals(animals)
    setAnimals?.(animals)
    methods.reset()
  }
  const errors = methods.formState.errors
  return (
    <div>
      <h5 className="text-lg font-bold">
        {isBirth ? 'Camada' : 'Nuevos aretes'}
      </h5>
      <table className="table w-full">
        {!!_animals.length && (
          <thead>
            <tr>
              <td>Arete</td>
              <td>Sexo</td>
              <td>Peso</td>
              <td>Elim</td>
            </tr>
          </thead>
        )}
        <tbody>
          {_animals.map((animal, i) => (
            <tr key={animal?.earring}>
              <td>{animal.earring}</td>
              {/* <td>{animal.name}</td> */}
              <td>{animal.gender}</td>
              <td>{animal?.weight}</td>
              <td>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleRemove(i)
                  }}
                  className="btn btn-outline btn-circle btn-error btn-xs"
                >
                  <Icon name="delete" size="xs" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <FormProvider {...methods}>
          <tfoot>
            <tr className="">
              <td>
                <InputContainer
                  label="Arete"
                  name="earring"
                  type="text"
                  // type="number"
                  className="w-24"
                  rules={{ required: 'Campo requerido' }}
                />
              </td>
              <td>
                <span className="label-text">Sexo</span>
                <div className="flex flex-row ">
                  <span className="flex flex-col p-0.5 text-xs">
                    Hembra
                    <input
                      type="radio"
                      {...methods.register('gender', {
                        required: true
                      })}
                      value="female"
                    />
                  </span>
                  <span className="flex flex-col p-0.5 text-xs">
                    Macho
                    <input
                      type="radio"
                      {...methods.register('gender', {
                        required: true
                      })}
                      value="male"
                    />
                  </span>
                </div>
                {errors.gender && (
                  <span className="text-error label-text">
                    Selecciona el sexo
                  </span>
                )}
              </td>
              <td>
                <InputContainer
                  label="Peso"
                  name="weight"
                  type="number"
                  className="w-[80px]"
                />
              </td>
              <td>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    methods.handleSubmit(onSubmit)()
                  }}
                  className="btn btn-circle btn-sm btn-success  "
                >
                  <Icon name="plus" />
                </button>
              </td>
            </tr>
          </tfoot>
        </FormProvider>
      </table>
    </div>
  )
}

export default AnimalsForm
