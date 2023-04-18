import useAnimal from '@comps/hooks/useAnimal'
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
  const { handleCreateBirth } = useCreateBirth({ breedingId })

  const otherMales = event?.eventData?.otherMales || []
  const males = [event?.eventData.breedingMale, ...otherMales]
  const mothers =
    event?.eventData.breedingBatch.map(({ id, earring }) => ({
      id,
      earring
    })) || []

  console.log(methods.watch())
  const onSubmit = (data: {
    calfs: any
    date: any
    fatherId: any
    motherId: any
  }) => {
    console.log(data)
    handleCreateBirth({
      breeding: { id: breedingId, name: event?.eventData.breedingId || '' },
      calfs: data.calfs,
      date: data.date,
      fatherId: data.fatherId,
      motherId: data.motherId
    })
  }

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
          <div className="flex w-full justify-center my-4">
            <button className="btn btn-info ">Guardar</button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default BirthForm
