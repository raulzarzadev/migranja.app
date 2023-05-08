import useEvent from '@comps/hooks/useEvent'
import useBreedingDates from '@comps/hooks/useBreedingDates'
import { FormProvider, useForm } from 'react-hook-form'
import InputContainer from '@comps/inputs/InputContainer'
import useCreateBirth, {
  CreateBirthLabelStatus
} from '@comps/hooks/useCreateBirth'
import AnimalsForm, { NewAnimal } from '@comps/AnimalsForm'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import ProgressBar from '@comps/ProgressBar'
import ProgressButton from '@comps/ProgressButton'

export interface NewCalf extends NewAnimal {}

const BirthForm = ({
  motherId = '',
  breedingId = '',
  title
}: {
  motherId?: string
  breedingId?: string
  title?: string
}) => {
  const { event } = useEvent({ eventId: breedingId })
  const fatherId = event?.eventData?.breedingMale?.id || ''
  const { breedingDates } = useBreedingDates({ breedingId })
  const farmAnimals = useSelector(selectFarmAnimals)
  const stallions = farmAnimals.filter((animal) => animal.isStallion)
  const females = farmAnimals.filter((animal) => animal.gender === 'female')
  // console.log({ farmAnimals })
  const calfs: NewCalf[] = []
  const defaultValues = {
    fatherId,
    motherId,
    batch: event?.eventData.breedingId,
    breeding: {
      id: event?.id || '',
      name: event?.eventData.breedingId || ''
    },
    date: breedingDates?.birthStartAt || new Date(),
    calfs
  }
  const methods = useForm({
    defaultValues
  })
  const farmValues = methods.watch()
  const { handleCreateBirth, status, progress } = useCreateBirth({
    breedingId,
    motherId: farmValues.motherId,
    fatherId: farmValues.fatherId
  })

  //const otherMales = event?.eventData?.otherMales || []

  const males = event?.eventData.breedingMale
    ? [event?.eventData.breedingMale]
    : //* if a breeding is not specified select all the males Stallion in the farm
      [...stallions]
  const mothers = event?.eventData.breedingBatch.map(({ id, earring }) => ({
    id,
    earring
    //* if a breeding is not specified select all the females in the farm
  })) || [...females]

  const onSubmit = async (data: { batch?: string; calfs: any; date: any }) => {
    await handleCreateBirth({
      calfs: data.calfs,
      date: data.date,
      batch: data.batch
    })
  }

  // console.log(methods.watch())

  const disabled = methods.watch('calfs').length <= 0 || progress === 100

  return (
    <div>
      {title && <h3 className="font-bold text-center">{title}</h3>}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="w-[250px] mx-auto">
            <InputContainer
              type="date"
              name="date"
              label="Fecha"
              //datesRangeColor={datesRangeColor}
            />
            <InputContainer
              name="batch"
              type="text"
              label="Lote/Monta (opcional)"
            />
            <InputContainer
              name="fatherId"
              type="select"
              selectOptions={males
                .map((male) => ({
                  label: male?.earring,
                  value: male?.id
                }))
                .sort((a: any, b: any) => a?.label - b?.label)}
              label="Macho"
            />
            <InputContainer
              name="motherId"
              type="select"
              selectOptions={mothers
                ?.map((male) => ({
                  label: male?.earring,
                  value: male?.id
                }))
                .sort((a: any, b: any) => a?.label - b?.label)}
              label="Hembra"
            />
          </div>

          <AnimalsForm
            isBirth
            animals={methods.watch('calfs')}
            setAnimals={(calfs) => {
              methods.setValue('calfs', calfs)
            }}
          />

          {progress === 100 && (
            <button
              className="btn btn-outline "
              onClick={(e) => {
                e.preventDefault()
                methods.reset()
              }}
            >
              Nuevo
            </button>
          )}
          <div className="flex w-full justify-center my-4">
            <ProgressButton progress={progress} disabled={disabled} />
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default BirthForm
