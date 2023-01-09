import AnimalsTable from 'components/AnimalsTable'
import InputContainer from 'components/inputs/InputContainer'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { HTMLProps, useEffect, useRef, useState } from 'react'
import HelperText from 'components/HelperText'
import { createGenericBreedingEvent } from '@firebase/Events/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { BreedingDetailsEvent } from 'components/FarmEvents/FarmEvent/FarmEvent.model'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmState } from 'store/slices/farmSlice'
import { fromNow } from 'utils/dates/myDateUtils'
import { getProperty } from 'dot-prop'
import { determinateRelationship } from 'utils/determinateRelationship'
import { ParentsType } from 'types/base/AnimalType.model'

const schema = yup.object().shape({
  breedingMale: yup.string().required('Este campo es necesario*')
})

const BreedingForm = () => {
  const currentFarm = useSelector(selectFarmState)
  const farmAnimals = useSelector(selectFarmAnimals)

  const [loading, setLoading] = useState(false)

  const methods = useForm({
    resolver: yupResolver(schema)
  })
  const { handleSubmit, watch, reset } = methods
  const formValues = watch()
  const males = farmAnimals.filter(({ gender }) => gender === 'male')
  //const females = farmAnimals.filter(({ gender }) => gender === 'female')
  const malesOptions = males?.map(({ earring, name }) => {
    return { label: `${earring}${name ? ` - ${name}` : ''}`, value: earring }
  })

  const excludeMalesAnimals = (animals: any[]) =>
    animals.filter(({ gender }) => gender === 'female')

  const excludeYongAnimals = (animals: any[]) => {
    const MIN_BREEDING_AGE_IN_MONTHS = 7
    return animals.filter(({ birthday }) => {
      const months = fromNow(birthday, { unit: 'month' }).split(' ')[0]
      return parseInt(months) > MIN_BREEDING_AGE_IN_MONTHS
    })
  }
  const excludeRelativeAnimals = (
    animals: any[],
    { breedingMaleEarring }: { breedingMaleEarring: any }
  ) => {
    return animals.filter((animal: any) => {
      const animalFather = getProperty(animal, 'parents.father.earring')

      return !!breedingMaleEarring && breedingMaleEarring !== animalFather
    })
  }

  const [sheepSelected, setSheepSelected] = useState<string[] | null>([])

  const onSubmit = async (data: any) => {
    setLoading(true)
    const breedingBatch: Partial<AnimalType>[] = femalesFiltered
      ?.filter(({ earring }) => sheepSelected?.includes(earring))
      .map((animal: any) => {
        return { ...animal, status: 'PENDING' }
      })
    const breedingMale: AnimalType | null =
      males?.find(({ earring }) => earring === data.breedingMale) || null
    // console.log({ ...data, breedingMale: male, breedingBatch })
    try {
      const res = await createGenericBreedingEvent<BreedingDetailsEvent>({
        eventData: {
          breedingBatch: breedingBatch,
          breedingId: data.batch,
          breedingMale,
          finishAt: data.finishAt,
          startAt: data.startAt,
          date: data.startAt
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

  const handleClear = () => {
    setSheepSelected([])
    reset()
  }
  const [femalesFiltered, setFemaleFiltered] = useState<any[]>([])

  useEffect(() => {
    //const animals = excludeMalesAnimals(farmAnimals)
    console.log({ sheepSelected })
    const formatAnimalsWithRelationMaleRelation = (
      cattle: { earring: string; parents?: ParentsType }[],
      male: string
    ) => {
      return cattle.map((animal: { earring: string }) => {
        const rel = determinateRelationship(male, animal.earring, cattle)
        return { ...animal, relationship: rel }
      })
    }

    const res = formatAnimalsWithRelationMaleRelation(
      farmAnimals,
      formValues.breedingMale
    )

    setFemaleFiltered(excludeMalesAnimals(res))
  }, [farmAnimals, formValues.breedingMale, sheepSelected])
  return (
    <div className="bg-base-300 rounded-md shadow-md  w-full mt-2">
      <div>
        <h3 className="text-xl text-center">Nueva monta</h3>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className=" ">
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
            <div className=" sm:max-w-full">
              <HelperText
                text="Selecciona las hembras que seran parte de la monta. Debes seleccionar al menos una"
                type="info"
              />
              <AnimalsTable
                showRelationshipCol
                animalsData={femalesFiltered || []}
                setSelectedRows={setSheepSelected}
                setSelectedRow={(row) =>
                  setSheepSelected([row?.earring as string])
                }
                settings={{ selectMany: true }}
                showSelectRow
              />
            </div>
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
