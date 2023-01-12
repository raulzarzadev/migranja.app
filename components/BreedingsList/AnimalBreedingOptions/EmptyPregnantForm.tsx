import ProgressButton from '@comps/ProgressButton'
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

  const [progress, setProgress] = useState(0)
  const onSubmit = async (data: any) => {
    setProgress(1)

    try {
      // ****************************************************   create birth
      const event = await createTypedEvent<EmptyDetailsEvent>({
        eventData: {
          ...animal.eventData,
          parents: {
            father: {
              id: animal.eventData.breedingMale?.id,
              earring: animal.eventData.breedingMale?.earring
              // inTheFarm: animal.eventData.breedingMale?.inTheFarm || false
            },
            mother: {
              id: animal.id,
              name: animal.name,
              earring: animal.earring
              // inTheFarm: animal.status === 'ACTIVE'
            }
          },
          date: data.date,
          comments: data?.comments
        },
        farm: {
          id: currentFarm?.id || '',
          name: currentFarm?.name || ''
        },
        type: 'EMPTY'
      })
      setProgress(50)

      // ***************************************************   update breeding, move from batch to already done

      const breeding = await updateAnimalStatusInBreedingBatch({
        animalId: animal?.id,
        eventType: 'EMPTY',
        eventId: animal.eventData.id
      })

      //const promises = [event, breeding]

      //await Promise.all(promises)

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
          <ProgressButton progress={progress} />
        </form>
      </FormProvider>
    </div>
  )
}

export default EmptyPregnantForm
