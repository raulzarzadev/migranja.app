import AnimalsTable from 'components/AnimalsTable'
import useFarm from 'components/hooks/useFarm'
import InputContainer from 'components/inputs/InputContainer'
import { FormProvider, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { selectFarmOvines } from 'store/slices/farmSlice'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'

const schema = yup.object().shape({
  breedingMale: yup.string().required('Este campo es necesario*')
  // startAt: yup.object().required('Este campo es necesario*').nullable(),
  // finishAt: yup.object().required('Este campo es necesario*').nullable()
})
// .required()

const BreedingForm = () => {
  const { currentFarm } = useFarm()
  const methods = useForm({
    resolver: yupResolver(schema)
  })
  const { handleSubmit, watch } = methods

  const males = currentFarm.animals?.filter(({ gender }) => gender === 'male')
  const females = currentFarm.animals?.filter(
    ({ gender }) => gender === 'female'
  )
  const malesOptions = males?.map((ovine) => {
    return { label: ovine.earring, value: ovine.earring }
  })

  const [sheepSelected, setSheepSelected] = useState<string[] | null>([])

  const onSubmit = (data) => {
    const breedingBatch = females?.filter(({ earring }) =>
      sheepSelected?.includes(earring)
    )
    const male = males?.find(({ earring }) => earring === data.breedingMale)
    console.log({ ...data, breedingMale: male, breedingBatch })
  }

  const formValues = watch()

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ******************************************** 
                Select bull               
     *******************************************rz */}
          <div className="p-2">
            <InputContainer
              label="Seleccionar macho "
              type="select"
              name="breedingMale"
              placeholder="Selecciona"
              selectOptions={malesOptions}
            />
          </div>
          {/* ******************************************** 
                Select Dates               
     *******************************************rz */}
          {formValues.breedingMale && (
            <div className="flex w-full justify-between my-2 p-2">
              <InputContainer type="date" name="startAt" label="Desde" />
              <InputContainer type="date" name="finishAt" label="Hasta" />
            </div>
          )}

          {/* ******************************************** 
                Select females               
       *******************************************rz */}
          {formValues.finishAt && formValues.startAt && (
            <AnimalsTable
              animalsData={females || []}
              setSelectedRows={setSheepSelected}
              setSelectedRow={(row) =>
                setSheepSelected([row?.earring as string])
              }
              settings={{ selectMany: true }}
            />
          )}
          {sheepSelected?.length && (
            <div className="flex justify-center w-full">
              <button className="btn btn-info ">Crear Monta</button>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  )
}

export default BreedingForm
