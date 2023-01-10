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
import {
  DTO_CreateFarmEventDropOut,
  FarmEventDropOut
} from 'types/base/FarmEventDropOut.model'

const DropInForm = ({ animalsIds }: { animalsIds: AnimalType['id'][] }) => {
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
    value: FarmEventDropOut['reason']
  }
  const dropOutReasons: DropOutReason[] = [
    { label: 'Por compra', value: 'BUY' },
    { label: 'Por nacimiento', value: 'BIRTH' }
  ]
  const farmAnimals = useSelector(selectFarmAnimals)
  const farmData = useSelector(selectFarmState)
  const user = useSelector(selectAuthState)
  const animals = farmAnimals
    .filter(({ id }) => animalsIds.includes(id))
    .map(({ id, earring, name }) => {
      return { id, name, earring }
    })
  //console.log(user)
  const [progress, setProgress] = useState(0)
  const onSubmit = async (data: any) => {
    setProgress(1)
    // actualizar animales
    const defineCurrentStatus: Record<
      FarmEventDropOut['reason'],
      AnimalType['currentStatus']
    > = {
      DEAD: 'DEAD',
      SOLD: 'SOLD',
      STOLE: 'STOLEN',
      LOST: 'LOST',
      BUY: 'ACTIVE',
      BIRTH: 'ACTIVE'
    }
    try {
      for (let i = 0; i < animals.length; i++) {
        const element = animals[i]
        const resup = await updateAnimal(element.id, {
          currentStatus:
            defineCurrentStatus[data?.reason as FarmEventDropOut['reason']]
        })
        setProgress((i * 80) / animals.length)
        console.log({ resup })
      }
      setProgress(50)

      const event: DTO_CreateFarmEventDropOut = {
        type: 'DROP_IN',
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
      console.log({ event })
      const res = await createDropOutEvent({ ...event })
      console.log({ res })
      setProgress(100)
    } catch (error) {
      console.log({ error })
    }
    //console.log({ data })
    //console.log(event)
  }

  return (
    <div>
      <h2 className="text-center font-bold my-4 ">Dar de alta</h2>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className={'grid gap-4'}>
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

export default DropInForm
