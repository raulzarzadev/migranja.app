import AnimalsTable from 'components/AnimalsTable'
import useFarm from 'components/hooks/useFarm'
import InputContainer from 'components/inputs/InputContainer'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'
import HelperText from 'components/HelperText'
import { createEvent, createGenericBreedingEvent } from '@firebase/Events/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { BreedingDetailsEvent } from 'components/FarmEvents/FarmEvent/FarmEvent.model'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmState } from 'store/slices/farmSlice'

const schema = yup.object().shape({
  breedingMale: yup.string().required('Este campo es necesario*')
  // startAt: yup.object().required('Este campo es necesario*').nullable(),
  // finishAt: yup.object().required('Este campo es necesario*').nullable()
})
// .required()

const BreedingForm = () => {
  // const { currentFarm, farmAnimals } = useFarm()
  const currentFarm = useSelector(selectFarmState)
  const farmAnimals = useSelector(selectFarmAnimals)

  const [loading, setLoading] = useState(false)

  const methods = useForm({
    resolver: yupResolver(schema)
  })
  const { handleSubmit, watch, reset } = methods

  const males = farmAnimals.filter(({ gender }) => gender === 'male')
  const females = farmAnimals.filter(({ gender }) => gender === 'female')
  const malesOptions = males?.map((ovine) => {
    return { label: ovine.earring, value: ovine.earring }
  })

  const [sheepSelected, setSheepSelected] = useState<string[] | null>([])

  const onSubmit = async (data: any) => {
    setLoading(true)
    const breedingBatch: Partial<AnimalType>[] = females
      ?.filter(({ earring }) => sheepSelected?.includes(earring))
      .map((animal) => {
        return { ...animal, status: 'PENDING' }
      })
    const breedingMale: AnimalType | null =
      males?.find(({ earring }) => earring === data.breedingMale) || null
    // console.log({ ...data, breedingMale: male, breedingBatch })
    try {
      const res = await createGenericBreedingEvent<BreedingDetailsEvent>({
        eventData: {
          breedingBatch: breedingBatch,
          breedingId: '',
          breedingMale,
          finishAt: data.finishAt,
          startAt: data.startAt
        },
        farm: {
          id: currentFarm?.id || '',
          name: currentFarm?.name || ''
        },
        type: 'BREEDING'
      })

      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
    setSheepSelected([])
    reset()
  }

  const formValues = watch()
  const handleClear = () => {
    setSheepSelected([])
    reset()
  }
  return (
    <div className="">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ******************************************** 
                Select bull               
     *******************************************rz */}
          <HelperText
            text="Selecciona las hembras que seran parte de la monta "
            type="info"
          />
          <div className="">
            <InputContainer
              className="w-36 mx-auto"
              label="Seleccionar macho "
              type="select"
              name="breedingMale"
              placeholder="Selecciona"
              selectOptions={malesOptions}
            />
          </div>
          {/* ******************************************** 
                Write the batch name               
     *******************************************rz */}
          <InputContainer
            className="w-36 mx-auto"
            type="text"
            name="batch"
            label="Lote"
            placeholder="lote"
          />
          {/* ******************************************** 
                Select Dates               
     *******************************************rz */}

          {formValues.breedingMale && formValues.batch && (
            <>
              <HelperText
                text="Selecciona las fechas aproximadas en las que se llevo a cabo la monta"
                type="info"
              />
              <div className="flex w-full justify-between my-2 p-2">
                <InputContainer type="date" name="startAt" label="Desde" />

                {formValues.startAt && (
                  <InputContainer
                    type="date"
                    name="finishAt"
                    label="Hasta"
                    min={formValues?.startAt}
                  />
                )}
              </div>
            </>
          )}

          {/* ******************************************** 
                Select females               
       *******************************************rz */}
          {formValues.finishAt && formValues.startAt && (
            <>
              <HelperText
                text="Selecciona las hembras que seran parte de la monta. Debes seleccionar al menos una"
                type="info"
              />
              <AnimalsTable
                animalsData={females || []}
                setSelectedRows={setSheepSelected}
                setSelectedRow={(row) =>
                  setSheepSelected([row?.earring as string])
                }
                settings={{ selectMany: true }}
              />
            </>
          )}
          <div className="flex justify-evenly w-full my-4">
            <div>
              <button
                disabled={loading}
                className="btn btn-info btn-outline"
                onClick={(e) => {
                  e.preventDefault()
                  handleClear()
                }}
              >
                Limpiar
              </button>
            </div>
            {!!sheepSelected?.length && (
              <button disabled={loading} className="btn btn-success">
                Crear Monta
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default BreedingForm
