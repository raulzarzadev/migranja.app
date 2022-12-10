import InputContainer, { SelectOption } from 'components/inputs/InputContainer'
import Modal from 'components/modal'
import { AnimalType } from 'firebase/types.model.ts/AnimalType.model'
import { useEffect, useState } from 'react'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { CreateAnimalDTO } from '../../firebase/Animal/animal.model'
import {
  createAnimal,
  getFemaleOvines,
  getMaleOvines
} from '../../firebase/Animal/main'

const SHEEP_BREEDS: SelectOption[] = [
  {
    label: 'Dorper',
    value: 'dorper'
  },
  {
    label: 'Mestizo',
    value: 'mix'
  }
]

const defaultValues = {
  birthday: new Date(),
  breed: null,
  earring: '',
  gender: null,
  joinedAt: new Date(),
  lote: null,
  parents: {
    father: null,
    mother: null
  }
}
const AnimalForm = ({ animal }: { animal?: CreateAnimalDTO }) => {
  const methods = useForm({
    defaultValues: { ...defaultValues, ...animal }
  })
  const { watch, handleSubmit } = methods
  const onSubmit = (data: any) => {
    console.log(data)
    createAnimal({ ...data })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }
  const formValues = watch()
  console.log(formValues)

  return (
    <div>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid place-content-center "
        >
          <AnimalTypeForm />
          <AnimalGenderForm />
          <InputContainer
            name="breed"
            type="select"
            label="Raza"
            selectOptions={SHEEP_BREEDS}
            placeholder="Selecciona Raza"
          />
          <InputContainer
            label="Arete"
            placeholder="Ej. 001"
            name="earring"
            type="text"
          />

          <InputContainer
            placeholder="Ej. 102"
            name="lote"
            type="text"
            label="Lote"
          />
          <InputContainer name="birthday" type="date" label="Nacimiento" />
          <InputContainer name="joinedAt" type="date" label="Incorporación" />
          <AnimalParentsForm />
          <button className="btn btn-primary my-4">Guardar</button>
        </form>
      </FormProvider>
    </div>
  )
}

const AnimalParentsForm = () => {
  type Parent = 'mother' | 'father'
  const { watch, register } = useFormContext()
  const formValues = watch()
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }

  const [parentGender, setParentGender] = useState<Parent>('father')
  const fatherIsPartOfTheFarm = formValues.parents?.[parentGender]?.inTheFarm

  const genderLabel: Record<Parent, string> = {
    mother: 'Madre',
    father: 'Padre'
  }

  const [parents, setParents] = useState<SelectOption[]>([])
  const formatOptions = (animals: AnimalType[]): SelectOption[] =>
    animals.map(({ id, earring }) => {
      return { label: earring, value: id }
    })

  useEffect(() => {
    if (fatherIsPartOfTheFarm == 'true') {
      if (parentGender === 'mother') {
        getFemaleOvines().then((res) => {
          console.log(res)
          setParents(formatOptions(res))
        })
      }
      if (parentGender === 'father') {
        getMaleOvines().then((res) => {
          console.log(res)
          setParents(formatOptions(res))
        })
      }
    }
  }, [fatherIsPartOfTheFarm])
  return (
    <div className="flex w-full justify-around my-2">
      <Modal
        title={` ${genderLabel[parentGender]} `}
        open={openModal}
        handleOpen={handleOpenModal}
      >
        <div>
          <div className="flex justify-center">
            <span>Es parte de la granja:</span>
            <div className="w-36 flex justify-around">
              <label className="flex items-center">
                <span className="mr-2">Si</span>
                <input
                  type={'radio'}
                  {...register(`parents.${parentGender}.inTheFarm`)}
                  value="true"
                />
              </label>

              <label className="flex items-center">
                <span className="mr-2">No</span>
                <input
                  type={'radio'}
                  {...register(`parents.${parentGender}.inTheFarm`)}
                  value="false"
                />
              </label>
            </div>
          </div>
          {/* <InputContainer
            label="Es parte de la granja"
            type={'checkbox'}
            name={'parents.father.inTheFarm'}
          /> */}
          {fatherIsPartOfTheFarm == 'true' && (
            <>
              <InputContainer
                name={`parents.${parentGender}.earring`}
                label="Arete"
                type="select"
                selectOptions={parents}
              />
            </>
          )}
          {fatherIsPartOfTheFarm == 'false' && (
            <>
              <InputContainer
                name={`parents.${parentGender}.earring`}
                label="Arete / Indentificador"
                type="text"
              />
              <InputContainer
                name={`parents.${parentGender}.breed`}
                label="Raza"
                type="text"
              />
              <InputContainer
                name={`parents.${parentGender}.birthday`}
                label="Nacimiento"
                type="date"
              />
            </>
          )}
        </div>
      </Modal>
      <button
        className="btn btn-sm w-1/2 btn-secondary"
        onClick={(e) => {
          e.preventDefault()
          setParentGender('father')
          handleOpenModal()
        }}
      >
        Padre
      </button>
      <button
        className="btn btn-sm w-1/2 btn-accent"
        onClick={(e) => {
          e.preventDefault()
          setParentGender('mother')
          handleOpenModal()
        }}
      >
        Madre
      </button>
    </div>
  )
}

const AnimalTypeForm = () => {
  const { register } = useFormContext()
  const ANIMAL_TYPES = [
    { label: 'Ovino', value: 'ovine' },
    { label: 'Bovino', value: 'bovine' }
  ]
  return (
    <>
      <span>Animal</span>
      <div className="flex w-36 justify-around">
        {ANIMAL_TYPES.map(({ label, value }) => (
          <label key={label} className="flex flex-col items-center">
            <span className="label-text">{label}</span>
            <input
              {...register('type')}
              type="radio"
              value={value}
              className="radio"
            />
          </label>
        ))}
      </div>
    </>
  )
}
const AnimalGenderForm = () => {
  const { register } = useFormContext()
  const ANIMAL_TYPES = [
    { label: 'Macho', value: 'Male' },
    { label: 'Hembra', value: 'Female' }
  ]
  return (
    <>
      <span>Sexo</span>
      <div className="flex w-36 justify-around">
        {ANIMAL_TYPES.map(({ label, value }) => (
          <label key={label} className="flex flex-col items-center">
            <span className="label-text">{label}</span>
            <input
              {...register('gender')}
              type="radio"
              value={value}
              className="radio"
            />
          </label>
        ))}
      </div>
    </>
  )
}

export default AnimalForm
