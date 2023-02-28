import ProgressButton from '@comps/ProgressButton'
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
  AbortDetailsEvent,
  AnimalBreedingEventCard
} from 'types/base/FarmEvent.model'

const AbortForm = ({ animal }: { animal: AnimalBreedingEventCard }) => {
  const currentFarm = useSelector(selectFarmState)
  //const farmAnimals = useSelector(selectFarmAnimals)
  const methods = useForm({
    defaultValues: {
      date: new Date(),
      comments: ''
    }
  })
  const { handleSubmit } = methods

  const [progress, setProgress] = useState(0)

  const onSubmit = async (data: any) => {
    setProgress(10)
    try {
      // CRATE ABORT EVENT
      const abortEvent = await createTypedEvent<AbortDetailsEvent>({
        eventData: {
          ...animal.eventData,
          parents: {
            father: {
              id: animal.eventData.breedingMale?.id,
              earring: animal.eventData.breedingMale?.earring,
              name: animal.eventData.breedingMale?.name
            },
            mother: {
              id: animal.id,
              earring: animal.earring,
              name: animal.name
            }
          }
        },
        farm: {
          id: currentFarm?.id || '',
          name: currentFarm?.name || ''
        },
        type: 'ABORT'
      })
      // UPDATE BREEDING EVENT
      setProgress(50)
      const breedingUpdate = await updateAnimalStatusInBreedingBatch({
        eventType: 'ABORT',
        animalId: animal?.id || '',
        eventId: animal.eventData.id
      })

      //* * * * * * * * * * * * * * * * * * * * * * * * update animal state
      setProgress(80)
      if (animal?.id) await updateAnimalState(animal?.id, 'FREE', animal.state)

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

export default AbortForm
