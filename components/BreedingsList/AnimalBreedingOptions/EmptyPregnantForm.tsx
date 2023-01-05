import {
  createBirthEvent,
  createGenericBreedingEvent,
  updateBreedingEventBatch
} from '@firebase/Events/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import useFarm from 'components/hooks/useFarm'
import InputContainer from 'components/inputs/InputContainer'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmState } from 'store/slices/farmSlice'
import { AnimalFormattedWhitGenericEvenData } from 'types/base/AnimalType.model'
import { formatNewGenericFarmEvent } from './birth.helper'

const EmptyPregnantForm = ({
  animal
}: {
  animal: AnimalFormattedWhitGenericEvenData
}) => {
  const currentFarm = useSelector(selectFarmState)
  const farmAnimals = useSelector(selectFarmAnimals)
  const methods = useForm({
    defaultValues: {
      date: new Date(),
      comments: ''
    }
  })
  const {
    watch,
    handleSubmit,
    reset,
    formState: { errors }
  } = methods
  const formValues = watch()

  const [progress, setProgress] = useState(0)

  // const onSubmit = async (data: any) => {
  //   setProgress(1)
  //   const emptyData = { ...data, ...defaultAnimalValues }
  //   try {
  //     console.log()
  //     // CRATE ABORT EVENT
  //     const abort = await createEmptyPregnantEvent({
  //       ...data,
  //       ...defaultAnimalValues
  //     })
  //     // UPDATE BREEDING EVENT
  //     console.log(abort)
  //     setProgress(50)
  //     const breedingUpdate = await updateBreedingWithEmptyPregnant(
  //       animal?.breeding?.id,
  //       animal?.id || '',
  //       { emptyData }
  //     )
  //     console.log(breedingUpdate)

  //     setProgress(100)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const onSubmit = async (data: any) => {
    setProgress(1)

    try {
      const { formatBirthEvent } = formatNewGenericFarmEvent({
        eventType: 'EMPTY',
        animal,
        calfs: data?.calfs || [],
        currentFarm,
        farmAnimals,
        formValues,
        breeding: animal.eventData
      })
      // ****************************************************   create birth
      const event = createGenericBreedingEvent(formatBirthEvent)
      setProgress(50)

      // ***************************************************   update breeding, move from batch to already done

      const breeding = updateBreedingEventBatch({
        //  breedingId: animal?.breeding?.id as string,
        eventId: animal.eventData.id,
        animalId: animal.id,
        eventType: 'BIRTH',
        eventData: formatBirthEvent
      })
      setProgress(75)

      const promises = [event, breeding]
      await Promise.all(promises).then((res: any) => {
        console.log(res)
      })
      setProgress(100)
      reset()
    } catch (error) {
      setProgress(0)
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
            label={'Comentarios (opcional)'}
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

export default EmptyPregnantForm
