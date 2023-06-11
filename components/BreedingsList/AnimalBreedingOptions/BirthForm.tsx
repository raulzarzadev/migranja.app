import useEvent from '@comps/hooks/useEvent'
import useBreedingDates from '@comps/hooks/useBreedingDates'
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext
} from 'react-hook-form'
import InputContainer from '@comps/inputs/InputContainer'
import useCreateBirth from '@comps/hooks/useCreateBirth'
import AnimalsForm, { NewAnimal } from '@comps/AnimalsForm'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmEvents } from 'store/slices/farmSlice'
import ProgressButton from '@comps/ProgressButton'
import Modal from '@comps/modal'
import useModal from '@comps/hooks/useModal'
import { myFormatDate } from 'utils/dates/myDateUtils'
import AnimalsCompatTable from '@comps/AnimalsCompatTable'
import { createError } from '@firebase/Errors/main'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import { useEffect, useState } from 'react'
import { AnimalType } from 'types/base/AnimalType.model'
import SearchEarringController from '@comps/SearchEarring/SearchEarringController'

export interface NewCalf extends NewAnimal {}

const BirthForm = ({
  motherId = '',
  breedingId = '',
  title
}: // isBreedingBirth
{
  motherId?: string
  breedingId?: string
  title?: string
  // isBreedingBirth?: boolean
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
    fatherEarring: '',
    motherEarring: '',
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
  const formValues = methods.watch()
  const selectedFather = farmAnimals.find(
    ({ earring, id }) =>
      id === formValues.fatherId || formValues.fatherEarring === earring
  )
  const selectedMother = farmAnimals.find(
    ({ earring, id }) =>
      formValues?.motherId === id || formValues.motherEarring === earring
  )
  const { handleCreateBirth, status, progress, setProgress } = useCreateBirth({
    breedingId: formValues.breeding.id,
    motherId: selectedMother?.id,
    fatherId: selectedFather?.id
  })

  const onSubmit = async (data: { batch?: string; calfs: any; date: any }) => {
    try {
      await handleCreateBirth({
        calfs: data.calfs,
        date: data.date,
        batch: data.batch || ''
      })
      setProgress(101)
    } catch (error) {
      createError('CreateBirthError', error)
      setProgress(-1)
    }
  }

  const disabled = formValues?.calfs?.length <= 0 || progress === 100
  const modal = useModal()

  const handleReset = () => {
    methods.reset()
    setProgress(0)
  }
  const isBreedingBirth = !!formValues.breeding.id
  return (
    <div className="">
      {title && (
        <h3 className="font-bold text-center">
          {title} <span>{selectedMother?.earring}</span>
        </h3>
      )}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="">
            <InputContainer
              type="date"
              name="date"
              label="Fecha de nacimiento"
              // datesRangeColor={datesRangeColor}
              containerClassName="w-[250px] mx-auto"
            />
            <InputContainer
              name="batch"
              type="text"
              label="Lote/Monta (opcional)"
              disabled={isBreedingBirth && !!defaultValues!.batch}
              containerClassName="w-[250px] mx-auto"
            />

            {isBreedingBirth && motherId ? (
              <span>
                Padre: <ModalAnimalDetails earring={selectedFather?.earring} />
              </span>
            ) : (
              <>
                <SearchEarringController
                  justStallion
                  name={'fatherEarring'}
                  relativeTo={
                    farmAnimals.find(
                      ({ id }) => methods.watch('motherEarring') === id
                    )?.earring
                  }
                  gender="male"
                  label="Padre"
                  // onEarringClick={(e) => {
                  //   methods.setValue('fatherId', e.id)
                  // }}
                  className="w-[250px] my-2 mx-auto"
                />
                <SelectedMaleBreedings
                  maleEarring={methods.watch('fatherEarring')}
                />
              </>
            )}
            {isBreedingBirth && fatherId ? (
              <span>
                Madre: <ModalAnimalDetails earring={selectedMother?.earring} />
              </span>
            ) : (
              <>
                <SearchEarringController
                  name={'motherEarring'}
                  relativeTo={
                    farmAnimals.find(
                      ({ id }) => methods.watch('fatherEarring') === id
                    )?.earring
                  }
                  gender="female"
                  label="Madre"
                  // onEarringClick={(e) => {
                  //   methods.setValue('motherId', e.id)
                  // }}
                  className="w-[250px] my-2 mx-auto"
                />
                <SelectedFemaleBreedings
                  motherEarring={methods.watch('motherEarring')}
                />
              </>
            )}
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
                  handleReset()
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
                    <span className="font-bold">
                      {selectedFather?.earring || ' sin '}
                    </span>
                  </p>
                  <p>
                    Madre:
                    <span className="font-bold">
                      {selectedMother?.earring ? (
                        <ModalAnimalDetails
                          earring={selectedMother?.earring}
                          size="md"
                        />
                      ) : (
                        ' sin '
                      )}
                    </span>{' '}
                  </p>
                  {formValues.batch && (
                    <p>
                      Lote:{' '}
                      <span className="font-bold">{formValues.batch}</span>
                    </p>
                  )}
                  <p>
                    Fecha del parto:{' '}
                    <span className="font-bold">
                      {myFormatDate(formValues.date, 'dd MMM yy')}
                    </span>
                  </p>
                  <AnimalsCompatTable
                    animals={formValues.calfs}
                    onRemove={(i) => {
                      const aux = formValues.calfs
                      aux.splice(i, 1)
                      methods.setValue('calfs', aux)
                    }}
                  />
                  <p className="text-xs italic my-2">
                    * Eventos relacionados: destete, cambios de estado de la
                    madre, nuevos animales, etc.
                  </p>
                  <p className="text-xs italic my-2">
                    ** Se descartara la madre de otras montas
                  </p>
                </div>
                {progress === 100 && (
                  <p className="text-center">Parto creado exitosamente</p>
                )}
                <ProgressButton
                  progress={progress}
                  disabled={disabled}
                  successButtonLabel="Cerrar"
                  onSuccess={() => {
                    handleReset()
                    modal.handleOpen()
                  }}
                />
              </Modal>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

const SelectedFemaleBreedings = ({
  motherEarring
}: {
  motherEarring: AnimalType['earring']
}) => {
  const [possibleFathers, setPossibleFathers] = useState<PossibleParent[]>([])
  const farmEvents = useSelector(selectFarmEvents)
  const methods = useFormContext()
  const formValues = methods.watch()

  const searchFatherActiveBreedings = (
    motherEarring: AnimalType['earring']
  ) => {
    return farmEvents.filter(
      (e) =>
        e.type === 'BREEDING' &&
        e.eventData?.breedingBatch.find((aml) => aml.earring === motherEarring)
    )
  }
  useEffect(() => {
    const breedings = searchFatherActiveBreedings(motherEarring)
    const breedingsInMales: PossibleParent[] = breedings
      .map(
        (
          breeding
        ): {
          id: string
          earring: string
          breeding: { id: string; name: string; breedingData: any }
        } => {
          const animal = breeding?.eventData?.breedingMale
          return {
            id: animal?.id || '',
            earring: animal?.earring || '',
            status: breeding.eventData.breedingBatch.find(
              (anml) => anml.earring === motherEarring
            )?.status,
            breeding: {
              id: breeding.id,
              name: breeding.eventData.breedingId,
              breedingData: breeding
            }
          }
        }
      )
      .filter((breeding) => breeding.status === 'PENDING')

    setPossibleFathers(breedingsInMales)
    //methods.setValue('fatherId', '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motherEarring])

  const isSelected = (fatherEarring: AnimalType['id'], breedingId: string) =>
    formValues?.fatherEarring === fatherEarring &&
    breedingId === formValues.breeding.id
  const handleSelectFather = (
    fatherEarring: string,
    breeding: { id: string; name: string }
  ) => {
    methods.setValue('fatherEarring', fatherEarring)
    methods.setValue('breeding', breeding)
    methods.setValue('batch', breeding.name)
  }

  return (
    <>
      <h4 className="text-center">Posibles padres</h4>
      <div className="flex w-full flex-wrap justify-center max-w-lg mx-auto">
        {possibleFathers?.map((animal, i) => (
          <button
            key={`${animal?.id}-${i}`}
            className={`
            ${
              isSelected(animal.earring, animal?.breeding?.id)
                ? ' border-base-content '
                : ' border-base-200 '
            }
             w-20 aspect-square text-center grid place-content-center m-0.5 rounded-md border-2 hover:border-base-content
        `}
            onClick={(e) => {
              e.preventDefault()
              handleSelectFather(animal.earring, {
                id: animal.breeding.id,
                name: animal.breeding.name
              })
            }}
          >
            <span className="text-xs ">
              Padre:{' '}
              <p className="font-bold whitespace-pre-wrap">{animal.earring}</p>{' '}
            </span>
            <span className="text-xs ">
              Monta:{' '}
              <p className="font-bold whitespace-pre-wrap">
                {animal.breeding.name}
              </p>
            </span>
          </button>
        ))}
      </div>
    </>
  )
}

const SelectedMaleBreedings = ({ maleEarring }: { maleEarring: string }) => {
  const [possibleMothers, setPossibleMothers] = useState<PossibleParent[]>([])
  const farmEvents = useSelector(selectFarmEvents)

  const searchFatherActiveBreedings = (
    fatherEarring: AnimalType['earring']
  ) => {
    return farmEvents.filter(
      (e) =>
        (e.type === 'BREEDING' &&
          e.eventData?.breedingMale?.earring === fatherEarring) ||
        e?.eventData?.otherMales?.find(
          (male) => male?.earring === fatherEarring
        )
    )
  }
  useEffect(() => {
    const breedings = searchFatherActiveBreedings(maleEarring)

    const femalesInBreeding: PossibleParent[] = breedings
      .map((breeding: any) =>
        breeding.eventData.breedingBatch?.map((animal: AnimalType) => ({
          id: animal.id,
          earring: animal.earring,
          status: animal.status,
          breeding: {
            id: breeding.id,
            name: breeding.eventData.breedingId,
            breedingData: breeding
          }
        }))
      )
      .flat()
    setPossibleMothers(
      femalesInBreeding.filter((animal) => animal.status === 'PENDING')
    )
    //methods.setValue('motherId', '')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maleEarring])

  const methods = useFormContext()
  const handleSelectMother = (
    motherEarring: string,
    breeding: { id: string; name: string }
  ) => {
    methods.setValue('motherEarring', motherEarring)
    methods.setValue('breeding', breeding)
    methods.setValue('batch', breeding.name)
  }
  const formValues = methods.watch()
  const isSelected = (motherEarring: AnimalType['id'], breedingId: string) =>
    formValues?.motherEarring === motherEarring &&
    breedingId === formValues.breeding.id

  if (!possibleMothers.length) return <></>

  return (
    <>
      <h4 className="text-center">Posibles madres</h4>
      <div className="flex w-full flex-wrap justify-center max-w-lg mx-auto">
        {possibleMothers.map((animal, i) => (
          <button
            key={`${animal?.id}-${i}`}
            className={`
                ${
                  isSelected(animal.earring, animal?.breeding?.id)
                    ? ' border-base-content '
                    : ' border-base-200 '
                }
            w-20 aspect-square text-center grid place-content-center m-0.5 rounded-md border-2 hover:border-base-content
            `}
            onClick={(e) => {
              e.preventDefault()
              handleSelectMother(animal.earring, {
                id: animal.breeding.id,
                name: animal.breeding.name
              })
            }}
          >
            <span className="text-xs ">
              Madre:{' '}
              <p className="font-bold whitespace-pre-wrap">{animal.earring}</p>
            </span>
            <span className="text-xs ">
              Monta:{' '}
              <p className="font-bold whitespace-pre-wrap">
                {animal.breeding.name}
              </p>{' '}
            </span>
          </button>
        ))}
      </div>
    </>
  )
}

interface PossibleParent {
  id: string
  earring: string
  status: string
  breeding: { id: string; name: string; breedingData: any }
}
export default BirthForm
