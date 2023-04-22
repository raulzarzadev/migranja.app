import { useState } from 'react'
import Icon from './Icon'
import InputContainer from './inputs/InputContainer'
import { FormProvider, useForm } from 'react-hook-form'
import { AnimalType } from 'types/base/AnimalType.model'
export interface NewAnimal {
  earring?: AnimalType['earring']
  gender?: 'male' | 'female'
  id?: AnimalType['id']
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
  }
  const errors = methods.formState.errors
  return (
    <div>
      <h5 className="text-lg font-bold">
        {isBirth ? 'Camada' : 'Nuevos aretes'}
      </h5>
      <FormProvider {...methods}>
        {_animals.map((animal, i) => (
          <tr key={animal?.earring}>
            <td>{animal.earring}</td>
            {/* <td>{animal.name}</td> */}
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
        <tr className="flex w-full justify-center items-center">
          <td>
            <InputContainer
              name="earring"
              type="text"
              // type="number"
              className="w-24"
              rules={{ required: 'Campo requerido' }}
            />
          </td>

          <td>
            <div className="flex flex-row">
              <span className="flex flex-col p-0.5">
                Hembra
                <input
                  type="radio"
                  {...methods.register('gender', {
                    required: true
                  })}
                  value="female"
                />
              </span>
              <span className="flex flex-col p-0.5">
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
              <span className="text-error label-text">Selecciona el sexo</span>
            )}
          </td>
          <td className="">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                methods.handleSubmit(onSubmit)()
              }}
            >
              <Icon name="plus" />
            </button>
          </td>
        </tr>
      </FormProvider>
    </div>
  )
}

export default AnimalsForm
