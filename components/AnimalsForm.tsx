import Icon from './Icon'
import InputContainer from './inputs/InputContainer'
import { FormProvider, useForm } from 'react-hook-form'
import { AnimalType } from 'types/base/AnimalType.model'
import useEarringAlreadyExist from './hooks/useEarringAlreadyExist'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AnimalState } from 'types/base/AnimalState.model'
import GENDER_OPTIONS from './CONSTANTS/GENDER_OPTIONS'

const schema = yup
  .object()
  .shape({
    state: yup.string().required('Este campo es necesario'),
    gender: yup.string().required('Este campo es necesario'),
    earring: yup
      .string()
      .required('Es necesario*')
      .min(3, 'Al menos 3 caracteres')
    //.max(3, 'Maximo 3 letras')
  })
  .required()

export interface NewAnimal {
  earring?: AnimalType['earring']
  gender?: 'male' | 'female'
  id?: AnimalType['id']
  weight: number
  state: AnimalType['state']
}

const AnimalsForm = ({
  isBirth,
  setAnimals,
  animals = []
}: {
  isBirth?: boolean
  setAnimals?: (animals: NewAnimal[]) => void
  animals?: NewAnimal[]
}) => {
  // const [_animals, _setAnimals] = useState<NewAnimal[]>([])
  const methods = useForm({
    resolver: yupResolver(schema)
  })
  const handleRemove = (index: number) => {
    const aux = [...animals]
    aux.splice(index, 1)
    setAnimals?.(aux)
    // _setAnimals(aux)
  }
  const { checkIfExist } = useEarringAlreadyExist()
  const onSubmit = (data: any) => {
    // const animals = [...animals, data]
    //_setAnimals(animals)
    if (
      checkIfExist(data?.earring) ||
      animals.find((a) => a.earring === data.earring)
    ) {
      methods.setError('earring', {
        type: 'validate',
        message: 'Este arete ya existe'
      })
    } else {
      const newAnimal = { ...data }

      console.log(newAnimal)
      setAnimals?.([...animals, newAnimal])
      methods.reset()
    }
  }
  const errors = methods.formState.errors
  return (
    <div>
      <h5 className="text-lg font-bold">
        {isBirth ? 'Camada' : 'Nuevos aretes'}
      </h5>
      <table className="table w-full table-compact">
        {!!animals.length && (
          <thead>
            <tr>
              <td>Arete</td>
              <td>Estado</td>
              <td>Sexo</td>
              <td>Peso</td>
              <td>Elim</td>
            </tr>
          </thead>
        )}
        <tbody>
          {animals.map((animal, i) => (
            <tr key={animal?.earring}>
              <td>{animal.earring}</td>
              <td className="capitalize">
                {AnimalState[animal.state || 'LACTATING']}
              </td>
              <td>{GENDER_OPTIONS[animal.gender || 'female'].label}</td>
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
                <div className="flex flex-col gap-2">
                  {/* <span className="flex  w-full justify-end p-0 text-xs">
                    Sancho
                    <input
                      type="radio"
                      {...methods.register('state', {
                        required: true
                      })}
                      disabled
                      value="SANCHO"
                    />
                  </span> */}
                  <span className="flex  w-full justify-end p-0 text-xs">
                    Lactante
                    <input
                      type="radio"
                      {...methods.register('state', {
                        required: true
                      })}
                      defaultChecked
                      value="LACTATING"
                    />
                  </span>
                  <span className="flex w-full justify-end p-0 text-xs">
                    Muerto
                    <input
                      type="radio"
                      {...methods.register('state', {
                        required: true
                      })}
                      value="DEAD"
                    />
                  </span>
                </div>
                {errors.state && (
                  <span className="text-error label-text text-xs whitespace-pre-line">
                    Selecciona status
                  </span>
                )}
              </td>
              <td>
                <span className="label-text">Sexo</span>
                <div className="flex flex-col ">
                  <span className="flex flex-col p-0 text-xs">
                    Hembra
                    <input
                      type="radio"
                      {...methods.register('gender', {
                        required: true
                      })}
                      value="female"
                    />
                  </span>
                  <span className="flex flex-col p-0 text-xs">
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
                  <span className="text-error label-text text-xs whitespace-pre-line">
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
