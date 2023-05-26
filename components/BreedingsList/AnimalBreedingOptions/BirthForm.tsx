import useEvent from '@comps/hooks/useEvent'
import useBreedingDates from '@comps/hooks/useBreedingDates'
import { FormProvider, useForm } from 'react-hook-form'
import InputContainer from '@comps/inputs/InputContainer'
import useCreateBirth from '@comps/hooks/useCreateBirth'
import AnimalsForm, { NewAnimal } from '@comps/AnimalsForm'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import ProgressButton from '@comps/ProgressButton'
import SearchEarring from '@comps/SearchEarring'
import Modal from '@comps/modal'
import useModal from '@comps/hooks/useModal'
import { myFormatDate } from 'utils/dates/myDateUtils'
import AnimalsCompatTable from '@comps/AnimalsCompatTable'

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

  const sortByCreatedDate = (a: any, b: any) => b.createdAt - a.createdAt
  //* Show the last male earring to have a reference for the next earrings
  const lastMaleCalfEarring = farmAnimals
    .filter(({ gender }) => gender === 'male')
    .sort(sortByCreatedDate)
    .shift()
  //* Show the last female earring to have a reference for the next earrings
  const lastFemaleCalfEarring = farmAnimals
    .filter(({ gender }) => gender === 'female')
    .sort(sortByCreatedDate)
    .shift()

  const calfs: NewCalf[] = []
  const defaultValues = {
    fatherId,
    motherId,
    batch: event?.eventData.breedingId || '',
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
  const { handleCreateBirth, status, progress, setProgress } = useCreateBirth({
    breedingId,
    motherId: farmValues.motherId,
    fatherId: farmValues.fatherId
  })

  const onSubmit = async (data: { batch?: string; calfs: any; date: any }) => {
    console.log({ data })
    try {
      await handleCreateBirth({
        calfs: data.calfs,
        date: data.date,
        batch: data.batch || ''
      })
      setProgress(101)
    } catch (error) {
      console.log({ error })
      setProgress(-1)
    }
  }

  const disabled = methods.watch('calfs').length <= 0 || progress === 100
  const modal = useModal()
  const selectedFather = farmAnimals.find(
    ({ id }) => methods.watch('fatherId') === id
  )
  const selectedMother = farmAnimals.find(
    ({ id }) => methods.watch('motherId') === id
  )

  return (
    <div>
      {title && <h3 className="font-bold text-center">{title}</h3>}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="w-[250px] mx-auto">
            <InputContainer
              type="date"
              name="date"
              label="Fecha de nacimiento"
              //datesRangeColor={datesRangeColor}
            />
            <InputContainer
              name="batch"
              type="text"
              label="Lote/Monta (opcional)"
            />

            <SearchEarring
              justStallion
              relativeTo={
                farmAnimals.find(({ id }) => methods.watch('motherId') === id)
                  ?.earring
              }
              gender="male"
              label="Padre"
              onEarringClick={(e) => {
                methods.setValue('fatherId', e.id)
              }}
              className="w-[250px] my-2"
            />
            <SearchEarring
              relativeTo={
                farmAnimals.find(({ id }) => methods.watch('fatherId') === id)
                  ?.earring
              }
              gender="female"
              label="Madre"
              onEarringClick={(e) => {
                methods.setValue('motherId', e.id)
              }}
              className="w-[250px] my-2"
            />
          </div>

          <AnimalsForm
            isBirth
            animals={methods.watch('calfs')}
            setAnimals={(calfs) => {
              methods.setValue('calfs', calfs)
            }}
          />

          <div className="mb-4 ">
            <div className="text-end text-sm italic">Ultimos creados</div>
            <div className="flex justify-end  text-sm italic">
              <span className="mr-1">
                macho:<strong>{lastMaleCalfEarring?.earring}</strong>{' '}
              </span>
              <span>
                hembra: <strong>{lastFemaleCalfEarring?.earring}</strong>
              </span>
            </div>
            <div className="flex w-full justify-evenly my-4 items-end">
              <button
                className="btn btn-outline "
                onClick={(e) => {
                  e.preventDefault()
                  methods.reset()
                  setProgress(0)
                }}
              >
                {progress === 100 ? 'Nuevo' : 'Limpiar'}
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault()
                  modal.handleOpen()
                }}
                className="btn btn-info "
                disabled={disabled}
              >
                Crear parto
              </button>
              <Modal {...modal} title="Crear parto">
                <div>
                  <h1>Crear el siguiente parto y los eventos relacionados*</h1>
                  <p>
                    Padre:
                    <span className="font-bold">{selectedFather?.earring}</span>
                  </p>
                  <p>
                    Madre:
                    <span className="font-bold">
                      {selectedMother?.earring}
                    </span>{' '}
                  </p>
                  {farmValues.batch && (
                    <p>
                      Lote:{' '}
                      <span className="font-bold">{farmValues.batch}</span>
                    </p>
                  )}
                  <p>
                    Fecha del parto:{' '}
                    <span className="font-bold">
                      {myFormatDate(farmValues.date, 'dd MMM yy')}
                    </span>
                  </p>
                  <AnimalsCompatTable
                    animals={farmValues.calfs}
                    onRemove={(i) => {
                      const aux = farmValues.calfs
                      aux.splice(i, 1)
                      methods.setValue('calfs', aux)
                    }}
                  />
                  <p className="text-xs italic my-2">
                    *Eventos relacionados: destete, cambios de estado de la
                    madre, nuevos animales, etc.
                  </p>
                </div>
                <ProgressButton progress={progress} disabled={disabled} />
              </Modal>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default BirthForm
