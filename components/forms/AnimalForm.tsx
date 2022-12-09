import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { CreateAnimalDTO } from '../../firebase/Animal/animal.model'
import { createAnimal } from '../../firebase/Animal/main'

const AnimalForm = ({ animal }: { animal?: CreateAnimalDTO }) => {
  const methods = useForm({
    defaultValues: animal
  })
  const { register, watch, handleSubmit } = methods
  const onSubmit = (data: any) => {
    console.log(data)
    createAnimal({ ...data })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  return (
    <div>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid place-content-center "
        >
          <AnimalTypeForm />
          <AnimalGenderForm />
          <label className="form-control">
            <span className="label-text">Arete</span>
            <input
              className="input input-bordered input-sm"
              {...register('earring')}
            />
          </label>
          <label className="form-control">
            <span className="label-text">Nacimiento</span>
            <input
              type={'date'}
              className="input input-bordered input-sm"
              {...register('earring')}
            />
          </label>
          <label className="form-control">
            <span className="label-text">Incorporación</span>
            <input
              type={'joinedAt'}
              className="input input-bordered input-sm"
              {...register('earring')}
            />
          </label>

          <button className="btn btn-primary">Guardar</button>
        </form>
      </FormProvider>
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
          <label className="flex flex-col items-center">
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
          <label className="flex flex-col items-center">
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
