import { createAnimal } from '@firebase/Animal/main'
import { createBirthEvent } from '@firebase/Events/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import useFarm from 'components/hooks/useFarm'
import InputContainer from 'components/inputs/InputContainer'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

const BirthForm = ({ animal }) => {
  const { currentFarmEarrings, currentFarm } = useFarm()
  const methods = useForm()
  const { watch, handleSubmit, setValue, register, reset } = methods
  const formValues = watch()

  const parentsDefaultData: AnimalType['parents'] = {
    father: {
      earring: animal.breeding?.breedingMale.earring || '',
      name: animal.breeding?.breedingMale.name || '',
      id: animal.breeding?.breedingMale.id || '',
      inTheFarm: true
    },
    mother: {
      earring: animal.earring || '',
      name: animal.name || '',
      id: animal.id || '',
      inTheFarm: true
    }
  }
  const defaultBirthValues: Partial<AnimalType> = {
    birthday: formValues.date || new Date(),
    type: 'ovine',
    name: '',
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
    try {
      // create birth
      const event = await createBirthEvent({
        type: 'BIRTH',
        date: formValues.date,

        farm: {
          id: currentFarm?.id,
          name: currentFarm?.name
        },
        parents: parentsDefaultData
      })
      console.log(event)
      setProgress(25)
      // create animals calfs
      for (let index = 0; index < data?.calfs.length; index++) {
        const element = data?.calfs[index]
        const animal = await createAnimal({
          ...element
        })
        console.log(animal)
        setProgress((index * 100) / data?.calfs?.length)
      }
      // update breeding, move from batch to already done
      setProgress(100)

      reset()
    } catch (error) {
      console.log(error)
    }

    setProgress(0)
    console.log(data)
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

          <div className="flex justify-evenly my-2">
            {!!formValues.date && (
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
            )}
          </div>
          {formValues?.calfs?.map((newAnimal, i) => (
            <div
              key={i}
              className="flex w-full items-center justify-evenly flex-col sm:flex-row my-2 "
            >
              <div className="divider" />

              <InputContainer
                rules={{
                  required: 'Este campo es necesario',
                  validate: (value) => {
                    return (
                      ![...currentFarmEarrings].includes(value) || 'Ya existe!'
                    )
                  }
                }}
                name={`calfs.${i}.earring`}
                type="text"
                placeholder="Arete"
                className="w-[120px] my-1"
              />
              <InputContainer
                name={`calfs.${i}.name`}
                type="text"
                placeholder="Nombre"
                className="w-[120px] my-1"
              />
              <InputContainer
                name={`calfs.${i}.weight`}
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

export default BirthForm
