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
  const onSubmit = (data?: any) => {
    if (
      checkIfExist(data?.earring || '') ||
      animals.find((a) => a.earring === data?.earring)
    ) {
      methods.setError('earring', {
        type: 'validate',
        message: 'Este arete ya existe'
      })
    } else {
      const newAnimal: NewAnimal = {
        weight: data?.weight || 0,
        state: data?.state || 'FREE',
        earring: data?.earring || '',
        gender: data?.gender || 'female'
      }
      console.log({ newAnimal })
      setAnimals?.([...animals, newAnimal])
      methods.reset()
    }
  }
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
                <InputContainer
                  type={'radios'}
                  label="Estado"
                  name="state"
                  radioOpts={[
                    {
                      label: 'Lactando',
                      value: 'LACTATING',
                      defaultChecked: true
                    },
                    {
                      label: 'Muerto',
                      value: 'DEAD'
                    }
                  ]}
                  rules={{
                    required: true
                  }}
                />
              </td>
              <td>
                <InputContainer
                  type={'radios'}
                  name="gender"
                  label="Sexo"
                  radioOpts={[
                    {
                      label: 'Hembra',
                      value: 'female'
                    },
                    {
                      label: 'Macho',
                      value: 'male'
                    }
                  ]}
                  rules={{
                    required: true
                  }}
                />
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
