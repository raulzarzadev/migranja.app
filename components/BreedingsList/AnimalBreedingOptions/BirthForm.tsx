import { createAnimal } from '@firebase/Animal/main'
import {
  createEvent,
  createGenericBreedingEvent,
  updateEventBreedingBatch
} from '@firebase/Events/main'
import InputContainer from 'components/inputs/InputContainer'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmState } from 'store/slices/farmSlice'
import { formatNewGenericFarmEvent } from './birth.helper'
import { BirthDetailsEvent } from 'components/FarmEvents/FarmEvent/FarmEvent.model'
import { AnimalFormattedWhitGenericEvenData } from 'types/base/AnimalType.model'
import ProgressButton from '@comps/ProgressButton'
import { creteAnimalWeaning } from '@firebase/Events/weaning.event'
import { addDays } from 'date-fns'
import FARM_DATES from '@comps/CONSTANTS/FARM_CONFIG/FARM_DATES'
import { AnimalBreedingEventCard } from 'types/base/FarmEvent.model'

const BirthForm = ({
  animal,
  possibleBirth
}: {
  animal: AnimalBreedingEventCard
  possibleBirth?: number | Date
}) => {
  const currentFarm = useSelector(selectFarmState)
  const farmAnimals = useSelector(selectFarmAnimals)
  const farmEarrings = useSelector(selectFarmAnimals)?.map(
    ({ earring }) => earring
  )
  const defaultCalf = {
    isAlive: true,
    gender: 'female',
    earring: ''
  }

  const methods = useForm({
    defaultValues: {
      calfs: [defaultCalf],
      birthType: 1,
      date: possibleBirth || new Date()
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
  // console.log({ formValues })
  useEffect(() => {
    let calfs = []
    for (let i = 0; i < parseInt(`${formValues?.birthType}`); i++) {
      calfs.push(defaultCalf)
    }
    setValue('calfs', calfs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animal, formValues?.birthType])

  const [progress, setProgress] = useState(0)
  const [labelStatus, setLabelStatus] = useState('')
  const breedingEventId = animal.eventData?.id
  const breedingBatchId = animal.eventData?.breedingId
  const breedingMale = animal.eventData?.breedingMale
  const onSubmit = async (data: any) => {
    setProgress(1)
    const { formatBirthEvent } = formatNewGenericFarmEvent<BirthDetailsEvent>({
      eventType: 'BIRTH',
      animal,
      calfs: data.calfs,
      currentFarm,
      farmAnimals,
      formValues,
      breeding: {
        breedingId: breedingBatchId,
        breedingMale: {
          inTheFarm: breedingMale?.inTheFarm || false,
          ...breedingMale
        }
      }
    })
    console.log({
      formatBirthEvent,
      updateBreeding: {
        eventId: breedingEventId || '',
        animalId: animal?.id as string,
        eventType: 'BIRTH'
      },
      calfs: formatBirthEvent.eventData.calfs,
      weaning: formatBirthEvent.eventData.calfs?.map((calf) => {
        return {
          type: 'WEANING',
          eventData: {
            status: 'PENDING',
            earring: calf.earring || '',
            date: addDays(data.date, FARM_DATES.DAYS_UNTIL_WEANING_AFTER_BIRTH)
          },
          farm: {
            id: currentFarm?.id || '',
            name: currentFarm?.name || ''
          }
        }
      })
    })
    //console.log({ formatBirthEvent, formValues })
    // return
    if (!breedingEventId) return console.log('no eventId')
    try {
      const newCalfs = formatBirthEvent.eventData.calfs || []
      // ****************************************************   create birth
      setLabelStatus('Creando evento')
      setProgress(10)
      console.log({ formatBirthEvent })
      const event = await createGenericBreedingEvent(formatBirthEvent)

      // ***************************************************   update breeding, move from batch to already done

      setLabelStatus('Actualizando breeding')
      setProgress(30)
      const breeding = await updateEventBreedingBatch({
        eventId: breedingEventId || '',
        animalId: animal?.id as string,
        eventType: 'BIRTH'
      })

      // *************************************************   create animals/calfs

      setLabelStatus('Creando animales')
      for (let i = 0; i < newCalfs?.length; i++) {
        const calf = newCalfs[i]
        await createAnimal({ ...calf, status: 'ACTIVE' })
        setProgress((i * 60) / newCalfs.length)
      }

      setLabelStatus('Creando detetes')
      // *************************************************   create animals weaning

      for (let i = 0; i < newCalfs.length; i++) {
        const calf = newCalfs[i]
        await creteAnimalWeaning({
          type: 'WEANING',
          eventData: {
            status: 'PENDING',
            earring: calf.earring || '',
            date: addDays(
              data.date,
              FARM_DATES.DAYS_UNTIL_WEANING_AFTER_BIRTH
            ).getTime()
          },
          farm: {
            id: currentFarm?.id || '',
            name: currentFarm?.name || ''
          }
        })
        setProgress((i * 100) / newCalfs.length)
      }

      setProgress(100)
      setFinishView(true)
      reset()
    } catch (error) {
      setProgress(0)
      console.log(error)
    }
  }
  const [finishView, setFinishView] = useState(false)
  // console.log({ formValues })

  return (
    <div>
      <FormProvider {...methods}>
        <h4 className="text-center text-xl ">Crear parto </h4>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full flex justify-center">
            <InputContainer
              type="date"
              name="date"
              label="Fecha"
              className="w-[150px]"
            />
          </div>

          {!!formValues?.date && (
            <>
              <div className="flex justify-evenly my-2">
                <InputContainer
                  className="w-[150px]"
                  label="Tipo de parto"
                  name="birthType"
                  type="select"
                  selectOptions={[
                    { label: '1', value: 1 },
                    { label: '2', value: 2 },
                    { label: '3', value: 3 }
                  ]}
                />
              </div>
            </>
          )}

          {formValues?.birthType && (
            <div className="grid grid-cols-4 place-items-center my-3 mt-8 font-bold  ">
              <span>Vivo</span>
              <span className="w-[120px] text-center">Sexo</span>
              <span className="w-[100px] text-center">Arete</span>
              {/* <span className="w-[120px] text-center">Nombre</span> */}
              <span className="w-[120px] text-center">Peso</span>
            </div>
          )}

          {formValues?.calfs?.map((_newAnimal: any, i: number) => (
            <div key={i} className="grid grid-cols-4 place-items-center">
              <InputContainer
                name={`calfs.${i}.isAlive`}
                type="checkbox"
                inputClassName="checkbox-success"
                defaultChecked
              />
              <div className="flex justify-center">
                <label className="flex flex-col">
                  <span>Macho</span>
                  <input
                    {...register(`calfs.${i}.gender`, {
                      required: 'Selecciona el sexo'
                    })}
                    type={'radio'}
                    value="male"
                  />
                </label>
                <label className="flex flex-col">
                  <span>Hembra</span>
                  <input
                    {...register(`calfs.${i}.gender`, {
                      required: true
                    })}
                    type={'radio'}
                    value="female"
                  />
                </label>
              </div>
              <InputContainer
                rules={{
                  // required: 'Este campo es necesario',
                  validate: {
                    alreadyExist: (value) =>
                      ![...farmEarrings].includes(value) || 'Ya existe!',
                    isRequired: (value) => !!value || 'Es necesario',
                    min: (value) =>
                      String(value).length >= 3 || 'Al menos 3 numeros'
                  }
                }}
                name={`calfs.${i}.earring`}
                type="text"
                placeholder="Arete"
                className="w-[100px] my-1"
              />

              {/* <InputContainer
                name={`calfs.${i}.name`}
                type="text"
                placeholder="Nombre"
                className="w-[120px] my-1"
              /> */}
              <InputContainer
                name={`calfs.${i}.weight.atBirth`}
                type="number"
                placeholder="Peso"
                className="w-[120px] my-1"
                min="0"
                max="10"
                step="0.01"
              />
              <div>
                <div>
                  {errors?.calfs?.[i]?.gender && (
                    <span className="label-text text-error">
                      {errors?.calfs[i]?.gender?.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="mt-10">
            <ProgressButton label={labelStatus} progress={progress} />
          </div>
          {/* {progress > 0 && (
            <progress className="progress w-full" value={progress} max={100} />
          )}
          <div className="flex justify-center w-full mt-6">
            <button disabled={progress > 0} className="btn btn-info">
              Guardar
            </button>
          </div> */}
          {/* {finishView && (
            <div className="flex justify-center w-full mt-6">
              <Link href={`/${currentFarm?.id}`}>Ver parto</Link>
            </div>
          )} */}
        </form>
      </FormProvider>
    </div>
  )
}

export default BirthForm
