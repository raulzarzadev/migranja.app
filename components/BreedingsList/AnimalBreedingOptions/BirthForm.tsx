import { createAnimal } from '@firebase/Animal/main'
import { CreateBirthEventType } from '@firebase/Events/event.model'
import {
  createBirthEvent,
  updateBreedingWithBirth
} from '@firebase/Events/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import useFarm from 'components/hooks/useFarm'
import InputContainer from 'components/inputs/InputContainer'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
const schema = yup
  .object()
  .shape({
    earring: yup
      .string()
      .required('Este campo es necesario*')
      .min(3, 'Al menos 3 letras')
  })
  .required()

const BirthForm = ({ animal }: { animal: Partial<AnimalType> }) => {
  const { currentFarmEarrings, currentFarm } = useFarm()
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
  const motherLastVersion =
    currentFarm?.animals?.find(({ id }) => id == animal.id) || animal
  const fatherLastVersion =
    currentFarm?.animals?.find(
      ({ id }) => id == animal?.breeding?.breedingMale?.id
    ) || animal?.breeding?.breedingMale
  const parentsDefaultData: AnimalType['parents'] = {
    father: {
      breed: fatherLastVersion?.breed || '',
      earring: fatherLastVersion?.earring || '',
      name: fatherLastVersion?.name || '',
      id: fatherLastVersion?.id || '',
      inTheFarm: true
    },
    mother: {
      breed: motherLastVersion?.breed || '',
      earring: motherLastVersion?.earring || '',
      name: motherLastVersion?.name || '',
      id: motherLastVersion?.id || '',
      inTheFarm: true
    }
  }

  const defaultBirthValues: Partial<AnimalType> = {
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
  useEffect(() => {
    let calfs = []
    for (let i = 0; i < parseInt(formValues?.birthType || 0); i++) {
      calfs.push(defaultBirthValues)
    }
    setValue('calfs', calfs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animal, formValues?.birthType, formValues.date])

  const [progress, setProgress] = useState(0)

  const onSubmit = async (data: any) => {
    setProgress(1)
    console.log(data)
    const formatBirthEvent: CreateBirthEventType = {
      type: 'BIRTH',
      date: formValues.date,

      farm: {
        id: currentFarm?.id,
        name: currentFarm?.name
      },
      parents: parentsDefaultData,
      birthData: data
    }
    const motherBreed = parentsDefaultData.mother?.breed
    const fatherBreed = parentsDefaultData.father?.breed
    const breed =
      motherBreed ??
      (motherBreed === fatherBreed
        ? fatherBreed
        : `1/2${fatherBreed}-1/2${motherBreed}`)

    const formattedCalfs = data?.calfs?.map((calf: any) => {
      const status: AnimalType['currentStatus'] = calf.isAlive
        ? 'ACTIVE'
        : 'DEAD'
      return {
        currentStatus: status,
        ...calf,
        birthType: data?.calfs?.length,
        breed: breed?.replaceAll(' ', '')
      }
    })
    const formatBreedingEvent = { ...data, calfs: formattedCalfs }

    return
    try {
      // *************************************************   create animals/calfs
      formattedCalfs.forEach(async (calf: any, i: number) => {
        //const newAnimal: AnimalType = { weight:{atBirth:calf.w} }
        const r = await createAnimal({ ...calf }).then((res) =>
          console.log(res)
        )
        setProgress((i * 100) / formattedCalfs?.length)
        console.log(r)
      })
      // ****************************************************   create birth
      const event = await createBirthEvent(formatBirthEvent)
      console.log(event)

      setProgress(50)

      // ***************************************************   update breeding, move from batch to already done

      const breeding = await updateBreedingWithBirth(
        animal?.breeding?.id as string,
        animal?.id as string,
        {
          birthData: formatBreedingEvent
        }
      )
      console.log(breeding)
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
                      ![...currentFarmEarrings].includes(value) || 'Ya existe!',
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
