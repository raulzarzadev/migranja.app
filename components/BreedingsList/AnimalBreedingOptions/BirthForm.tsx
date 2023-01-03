import { createAnimal } from '@firebase/Animal/main'
import { createBirthEvent, updateBreedingBatch } from '@firebase/Events/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import InputContainer from 'components/inputs/InputContainer'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmState } from 'store/slices/farmSlice'
import useDebugInformation from 'components/hooks/useDebugInformation'
import { formatBirthData } from './birth.helper'

const BirthForm = ({ animal }: { animal: Partial<AnimalType> }) => {
  useDebugInformation('BirthForm', animal)
  // const { farmEarrings, currentFarm } = useFarm()
  const currentFarm = useSelector(selectFarmState)
  const farmAnimals = useSelector(selectFarmAnimals)
  const farmEarrings = useSelector(selectFarmAnimals)?.map(
    ({ earring }) => earring
  )
  const methods = useForm()
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
    for (let i = 0; i < parseInt(formValues?.birthType || 0); i++) {
      calfs.push({})
    }
    setValue('calfs', calfs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animal, formValues?.birthType])

  const [progress, setProgress] = useState(0)

  const onSubmit = async (data: any) => {
    setProgress(1)
    const { formatBirthEvent } = formatBirthData({
      eventType: 'BIRTH',
      animal,
      calfs: data.calfs,
      currentFarm,
      farmAnimals,
      formValues
    })
    //console.log(formatBreedingEvent.formatBirthEvent)
    //return
    const newCalfs = formatBirthEvent.birthData.calfs || []
    try {
      // *************************************************   create animals/calfs
      const calfs = newCalfs.map((calf: any, i: number) => {
        //const newAnimal: AnimalType = { weight:{atBirth:calf.w} }
        setProgress((i * 100) / newCalfs?.length)
        return createAnimal({ ...calf })
        // console.log(r)
      })
      // ****************************************************   create birth
      const event = createBirthEvent(formatBirthEvent)
      setProgress(50)

      // ***************************************************   update breeding, move from batch to already done

      const breeding = updateBreedingBatch({
        breedingId: animal?.breeding?.id as string,
        animalId: animal?.id as string,
        eventType: 'BIRTH',
        eventData: formatBirthEvent
        // {
        //   birthData: formatBirthEvent
        // }
      })
      setProgress(75)

      const promises = [...calfs, event, breeding]
      await Promise.all(promises).then((res: any) => {
        console.log(res)
        //setProgress((i * 100) / promises?.length)
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

          {!!formValues.date && (
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

          {formValues.birthType && (
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
              />
              <div>
                <div className="flex">
                  <label className="flex flex-col">
                    <span>Macho</span>
                    <input
                      {...register(`calfs.${i}.gender`)}
                      type={'radio'}
                      value="male"
                      checked
                    />
                  </label>
                  <label className="flex flex-col">
                    <span>Hembra</span>
                    <input
                      {...register(`calfs.${i}.gender`)}
                      name={`calfs.${i}.gender`}
                      type={'radio'}
                      value="female"
                    />
                  </label>
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
