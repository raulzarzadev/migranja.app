import Icon from './Icon'
import InputContainer from './inputs/InputContainer'
import { FormProvider, useForm } from 'react-hook-form'
import { AnimalType } from 'types/base/AnimalType.model'
import useEarringAlreadyExist from './hooks/useEarringAlreadyExist'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AnimalState } from 'types/base/AnimalState.model'
import GENDER_OPTIONS from './CONSTANTS/GENDER_OPTIONS'
import AnimalsCompatTable from './AnimalsCompatTable'

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
        weight: parseFloat(data?.weight) || 0,
        state: data?.state || 'FREE',
        earring: data?.earring || '',
        gender: data?.gender || 'female'
      }
      setAnimals?.([...animals, newAnimal])
      methods.reset()
    }
  }
  const initialAnimalState: {
    label: string
    value: AnimalType['state']
  }[] = [
    {
      label: AnimalState.FREE,
      value: 'FREE'
    },
    {
      label: AnimalState.PREGNANT,
      value: 'PREGNANT'
    },
    {
      label: AnimalState.LACTATING,
      value: 'LACTATING'
    },
    {
      label: AnimalState.DEAD,
      value: 'DEAD'
    }
  ]
  return (
    <div>
      <AnimalsCompatTable
        animals={animals}
        title="Camada"
        onRemove={(i) => handleRemove(i)}
      />
      <h3 className="text-center font-bold text-xl">Agregar cría</h3>
      <table className="table w-full table-compact">
        <FormProvider {...methods}>
          <tbody>
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
                  //@ts-ignore
                  radioOpts={initialAnimalState}
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
          </tbody>
        </FormProvider>
      </table>
    </div>
  )
}

export default AnimalsForm
