import { createAnimal } from '@firebase/Animal/main'
import {
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
import {
  AnimalFormattedWhitGenericEvenData,
  ParentType
} from 'types/base/AnimalType.model'

const BirthForm = ({
  animal
}: {
  animal: AnimalFormattedWhitGenericEvenData
}) => {
  const currentFarm = useSelector(selectFarmState)
  const farmAnimals = useSelector(selectFarmAnimals)
  const farmEarrings = useSelector(selectFarmAnimals)?.map(
    ({ earring }) => earring
  )
  const defaultCalf = {
    gender: 'female',
    earring: ''
  }

  const methods = useForm({
    defaultValues: {
      calfs: [defaultCalf],
      birthType: 1,
      date: new Date()
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

  useEffect(() => {
    let calfs = []
    for (let i = 0; i < parseInt(`${formValues?.birthType}`); i++) {
      calfs.push(defaultCalf)
    }
    setValue('calfs', calfs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animal, formValues?.birthType])

  const [progress, setProgress] = useState(0)
  const breedingEventId = animal.eventData.id
  const breedingBatchId = animal.eventData.breedingId
  const breedingMale = animal.eventData.breedingMale
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
        breedingMale
      }
    })

    try {
      const newCalfs = formatBirthEvent.eventData.calfs
      // *************************************************   create animals/calfs
      const calfs = newCalfs?.map((calf: any, i: number) => {
        //const newAnimal: AnimalType = { weight:{atBirth:calf.w} }
        setProgress((i * 100) / newCalfs?.length)
        return createAnimal({ ...calf })
        // console.log(r)
      })
      // ****************************************************   create birth
      const event = createGenericBreedingEvent(formatBirthEvent)
      setProgress(50)

      // ***************************************************   update breeding, move from batch to already done

      const breeding = updateEventBreedingBatch({
        eventId: breedingEventId || '',
        animalId: animal?.id as string,
        eventType: 'BIRTH'
      })
      setProgress(75)

      const promises = [...(calfs || []), event, breeding]
      await Promise.all(promises).then((res: any) => {})
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
            <div className="flex w-full justify-evenly  ">
              <span>Vivo</span>
              <span className="w-[100px] text-center">Arete</span>
              <span className="w-[120px] text-center">Nombre</span>
              <span className="w-[120px] text-center">Peso</span>
              <span className="w-[120px] text-center">Sexo</span>
            </div>
          )}

          {formValues?.calfs?.map((_newAnimal: any, i: number) => (
            <div
              key={i}
              className="flex w-full items-center justify-evenly flex-col sm:flex-row my-2 "
            >
              <div className="divider" />
              <InputContainer
                name={`calfs.${i}.isAlive`}
                type="checkbox"
                inputClassName="checkbox-success"
              />
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

              <InputContainer
                name={`calfs.${i}.name`}
                type="text"
                placeholder="Nombre"
                className="w-[120px] my-1"
              />
              <InputContainer
                name={`calfs.${i}.weight.atBirth`}
                type="number"
                placeholder="Peso"
                className="w-[120px] my-1"
                min="0"
                step="0.01"
              />
              <div>
                <div>
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
                  {errors?.calfs?.[i]?.gender && (
                    <span className="label-text text-error">
                      {errors?.calfs[i]?.gender?.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {progress > 0 && (
            <progress className="progress w-full" value={progress} max={100} />
          )}
          <div className="flex justify-center w-full mt-6">
            <button disabled={progress > 0} className="btn btn-info">
              Guardar
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default BirthForm
