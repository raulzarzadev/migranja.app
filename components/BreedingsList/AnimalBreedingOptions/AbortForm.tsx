import { createAnimal } from '@firebase/Animal/main'
import { CreateBirthEventType } from '@firebase/Events/event.model'
import {
  createAbortEvent,
  createBirthEvent,
  updateBreedingWithAbort,
  updateBreedingWithBirth
} from '@firebase/Events/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import useFarm from 'components/hooks/useFarm'
import InputContainer from 'components/inputs/InputContainer'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

const AbortForm = ({ animal }: { animal: Partial<AnimalType> }) => {
  const { currentFarmEarrings, currentFarm } = useFarm()
  const methods = useForm({
    defaultValues: {
      date: new Date(),
      comments: ''
    }
  })
  const {
    watch,
    handleSubmit,
    setValue,
    register,
    reset,
    formState: { errors }
  } = methods
  const formValues = watch()

  const parentsDefaultData: AnimalType['parents'] = {
    father: {
      earring: animal.breeding?.breedingMale.earring || '',
      name: animal.breeding?.breedingMale.name || '',
      id: animal.breeding?.breedingMale.id || '',
      inTheFarm: true
    },
    mother: {
      earring: animal.earring || '',
      name: animal.name || '',
      id: animal.id || '',
      inTheFarm: true
    }
  }
  const defaultAnimalValues: Partial<AnimalType> = {
    birthday: formValues.date || new Date(),
    type: 'ovine',
    name: '',
    batch: animal.breeding?.batch || '',
    weight: {
      atBirth: 0
    },
    farm: {
      id: currentFarm.id,
      name: currentFarm.name
    },
    parents: parentsDefaultData
  }

  const [progress, setProgress] = useState(0)

  const onSubmit = async (data: any) => {
    setProgress(1)
    const abortData = { ...data, ...defaultAnimalValues }
    try {
      console.log()
      // CRATE ABORT EVENT
      const abort = await createAbortEvent({ ...data, ...defaultAnimalValues })
      // UPDATE BREEDING EVENT
      console.log(abort)
      setProgress(50)
      const breedingUpdate = await updateBreedingWithAbort(
        animal?.breeding?.id,
        animal?.id,
        { abortData }
      )
      console.log(breedingUpdate)

      setProgress(100)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full flex justify-center">
            <InputContainer
              type="date"
              name="date"
              label="Fecha"
              className="w-[150px]"
            />
          </div>

          <InputContainer
            label={'Comentarios (sopcional)'}
            name={`comments`}
            type="textarea"
            placeholder="Commentarios"
            className="my-1"
          />

          {progress > 0 && (
            <progress className="progress w-full" value={progress} max={100} />
          )}

          <div className="flex justify-center w-full">
            <button disabled={progress > 0} className="btn btn-info">
              Guardar
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default AbortForm
