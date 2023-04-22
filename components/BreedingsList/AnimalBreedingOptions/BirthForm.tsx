import useEvent from '@comps/hooks/useEvent'
import useBreedingDates from '@comps/hooks/useBreedingDates'
import { FormProvider, useForm } from 'react-hook-form'
import InputContainer from '@comps/inputs/InputContainer'
import useCreateBirth from '@comps/hooks/useCreateBirth'
import AnimalsForm, { NewAnimal } from '@comps/AnimalsForm'

export interface NewCalf extends NewAnimal {}

const BirthForm = ({
  motherId,
  breedingId
}: {
  motherId: string
  breedingId: string
}) => {
  const { event } = useEvent({ eventId: breedingId })
  const fatherId = event?.eventData?.breedingMale?.id || ''
  const { breedingDates } = useBreedingDates({ breedingId })
  const calfs: NewCalf[] = []
  const defaultValues = {
    fatherId,
    motherId,
    batch: event?.eventData.breedingId,
    breeding: {
      id: event?.id,
      name: event?.eventData.breedingId
    },
    date: breedingDates.birthStartAt,
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
  const males = [event?.eventData.breedingMale]
  const mothers =
    event?.eventData.breedingBatch.map(({ id, earring }) => ({
      id,
      earring
    })) || []

  const onSubmit = async (data: { calfs: any; date: any }) => {
    await handleCreateBirth({
      calfs: data.calfs,
      date: data.date
    })
  }

  const disabled = methods.watch('calfs').length <= 0

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <InputContainer
            type="date"
            name="date"
            label="Fecha"
            //datesRangeColor={datesRangeColor}
          />
          <InputContainer name="batch" type="text" label="Monta (opcional)" />
          <InputContainer
            name="fatherId"
            type="select"
            selectOptions={males.map((male) => ({
              label: male?.earring,
              value: male?.id
            }))}
            label="Macho"
          />
          <InputContainer
            name="motherId"
            type="select"
            selectOptions={mothers?.map((male) => ({
              label: male?.earring,
              value: male?.id
            }))}
            label="Hembras"
          />

          <AnimalsForm
            isBirth
            setAnimals={(calfs) => {
              methods.setValue('calfs', calfs)
            }}
          />
          <span>{status}</span>
          <progress
            value={progress}
            max={100}
            className="progress w-full"
          ></progress>
          <div className="flex w-full justify-center my-4">
            <button className="btn btn-info " disabled={disabled}>
              Guardar
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default BirthForm
