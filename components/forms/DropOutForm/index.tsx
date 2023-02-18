import { DorpInOutReasonsType } from '@comps/FarmEvents/FarmEvent/DropOutEventRow'
import { updateAnimal } from '@firebase/Animal/main'
import { createDropOutEvent } from '@firebase/Events/dropOput.event'
import InputContainer from 'components/inputs/InputContainer'
import ProgressButton from 'components/ProgressButton'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { selectAuthState } from 'store/slices/authSlice'
import { selectFarmAnimals, selectFarmState } from 'store/slices/farmSlice'
import { AnimalType } from 'types/base/AnimalType.model'
import { DTO_CreateFarmEventDropOut } from 'types/base/FarmEventDropOut.model'

const DropOutForm = ({
  animalsIds,
  setAnimals
}: {
  animalsIds: AnimalType['id'][]
  setAnimals?: (animals: any[]) => void
}) => {
  const methods = useForm({
    defaultValues: {
      reason: '',
      date: new Date(),
      comments: ''
    }
  })
  const { handleSubmit } = methods
  interface DropOutReason {
    label: string
    value: DorpInOutReasonsType
  }
  const dropOutReasons: DropOutReason[] = [
    { label: 'Por muerte', value: 'DEAD' },
    { label: 'Por venta', value: 'SOLD' },
    { label: 'Por robo', value: 'STOLEN' }
  ]
  const farmAnimals = useSelector(selectFarmAnimals)
  const farmData = useSelector(selectFarmState)
  const user = useSelector(selectAuthState)

  const animals = farmAnimals
    .filter(({ id }) => animalsIds.includes(id))
    .map(({ id, earring, name }) => {
      return { id, name, earring }
    })

  const [progress, setProgress] = useState(0)
  const onSubmit = async (data: any) => {
    setProgress(1)

    //* update animals

    try {
      for (let i = 0; i < animals.length; i++) {
        const element = animals[i]
        await updateAnimal(element.id, {
          state: 'DEAD'
        })
      }
      setAnimals?.([])
      setProgress(50)

      const event: DTO_CreateFarmEventDropOut = {
        type: 'DROP_OUT',
        reason: data.reason,
        eventData: {
          animals: animals,
          comments: data.comments,
          date: data.date
        },
        createdBy: {
          id: user?.id || '',
          name: user?.name || user?.displayName || ''
        },
        farm: {
          id: farmData?.id || '',
          name: farmData?.name || ''
        }
      }

      // crear evento
      const res = await createDropOutEvent({ ...event })
      console.log({ event, res })
      setProgress(100)
    } catch (error) {
      console.log({ error })
    }
    //console.log({ data })
    //console.log(event)
  }

  return (
    <div>
      <h2 className="text-center font-bold my-4">Baja de animal</h2>
      <div>
        <FormProvider {...methods}>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <InputContainer
              type="select"
              selectOptions={dropOutReasons}
              name="reason"
            />
            <InputContainer type="date" name="date" />
            <InputContainer type="textarea" name="comments" />
            <ProgressButton progress={progress} />
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

export default DropOutForm
