import ProgressButton from '@comps/ProgressButton'
import useEmptyAnimal from '@comps/hooks/useEmptyAnimal'
import { updateAnimalState } from '@firebase/Animal/main'
import {
  createTypedEvent,
  updateAnimalStatusInBreedingBatch
} from '@firebase/Events/main'
import InputContainer from 'components/inputs/InputContainer'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { selectFarmState } from 'store/slices/farmSlice'
import {
  AnimalBreedingEventCard,
  EmptyDetailsEvent
} from 'types/base/FarmEvent.model'

const EmptyPregnantForm = ({ animal }: { animal: AnimalBreedingEventCard }) => {
  const currentFarm = useSelector(selectFarmState)
  const methods = useForm({
    defaultValues: {
      date: new Date(),
      comments: ''
    }
  })
  const { handleSubmit, reset } = methods

  const { breedingEmptyAnimal, progress } = useEmptyAnimal()

  const onSubmit = async (data: any) => {
    breedingEmptyAnimal({
      animalId,
      breedingId,
      date: data.date,
      comments: data.comments
    })
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
          <ProgressButton progress={progress} />
        </form>
      </FormProvider>
    </div>
  )
}

export default EmptyPregnantForm
