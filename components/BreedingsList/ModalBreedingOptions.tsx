import Icon from '@comps/Icon'
import InputContainer from '@comps/inputs/InputContainer'
import { MalesTable } from '@comps/MalesTable'
import Modal from '@comps/modal'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import ModalDelete from '@comps/modal/ModalDelete'
import ProgressButton from '@comps/ProgressButton'
import SearchEarring from '@comps/SearchEarring'
import { updateAnimalState } from '@firebase/Animal/main'
import {
  addAnimalToBreedingBatchEvent,
  addMaleToBreedingEvent,
  deleteEvent,
  removeMaleFromBreedingEvent
} from '@firebase/Events/main'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import {
  BreedingEventCardDetails,
  OtherBreedingMale
} from 'types/base/FarmEvent.model'
import AnimalBreedingCardSmall from './AnimalBreedingCardSmall'

const ModalBreedingOptions = ({
  breeding
}: {
  breeding: BreedingEventCardDetails
}) => {
  const [openOptions, setOpenOptions] = useState(false)
  const handleOpenOptions = () => {
    setOpenOptions(!openOptions)
  }
  const breedingAnimals = breeding.eventData.breedingBatch
  const handleDelete = async () => {
    //* * * * * * * * * * * * * * * * * * * * * * * * * * update breeding animals state
    try {
      if (shouldUpdateAnimalState) {
        console.log('updating animals state')
        for (let i = 0; i < breedingAnimals?.length; i++) {
          const animal = breedingAnimals[i]
          if (animal?.id)
            await updateAnimalState(
              animal?.id,
              animal.pastState || 'FREE',
              animal.state
            )
        }
      }
      //* * * * * * * * * * * * * * * * * * * * * * * * * * delete breeding

      const res = await deleteEvent(breeding?.id)
      return console.log(res)
    } catch (error) {
      console.log({ error })
    }
  }

  const [shouldUpdateAnimalState, setShouldUpdateAnimalState] = useState(true)

  return (
    <div>
      <button
        className="btn btn-circle btn-xs btn-warning"
        onClick={(e) => {
          e.preventDefault()
          handleOpenOptions()
        }}
      >
        <Icon name="settings" size="xs" />
      </button>

      <Modal
        title="Opciones de monta"
        open={openOptions}
        handleOpen={handleOpenOptions}
      >
        <div className="flex w-full justify-around my-10">
          <AddBreedingMaleTo breeding={breeding} />
          <AddEarringTo breeding={breeding} />
          <ModalDelete
            buttonLabel={null}
            handleDelete={() => handleDelete()}
            text="Eliminaras esta monta y se actualizara el estado de los siguientes animales"
            title="Eliminar monta"
            openModalItem={(props) => (
              <button
                className="btn btn-outline btn-sm shadow-md btn-error"
                {...props}
              >
                Eliminar <Icon name="delete" />
              </button>
            )}
          >
            <div>
              <label className="items-center flex">
                <input
                  onChange={(e) => {
                    setShouldUpdateAnimalState(e.target.checked)
                  }}
                  className="checkbox mr-2"
                  type={'checkbox'}
                  checked={shouldUpdateAnimalState}
                />
                <span className="">
                  ¿Modificar estado de los siguientes animales ?
                </span>
              </label>
            </div>
            <div className="flex justify-evenly flex-wrap">
              {breedingAnimals.map((animal) => (
                <div key={animal.id}>
                  <ModalAnimalDetails earring={animal.earring} />
                </div>
              ))}
            </div>
          </ModalDelete>
        </div>
      </Modal>
    </div>
  )
}
const AddBreedingMaleTo = ({
  breeding
}: {
  breeding: BreedingEventCardDetails
}) => {
  const farmAnimals = useSelector(selectFarmAnimals)
  const lastMaleFinishAt = lastMaleFinishedAt(breeding)

  const [openModalToAddMale, setOpenModalToAddMale] = useState(false)
  const handleOpenModalToAddMale = () => {
    setOpenModalToAddMale(!openModalToAddMale)
  }
  const methods = useForm({
    defaultValues: {
      earring: '',
      name: '',
      startAt: lastMaleFinishAt,
      finishAt: lastMaleFinishAt,
      id: ''
    }
  })
  const handleAddMale = ({ earring }: { earring: string }) => {
    const animal = farmAnimals.find((animal) => animal.earring === earring)
    methods.setValue('earring', animal?.earring || '')
    methods.setValue('id', animal?.id || '')
  }

  const onSubmit = async (data: any) => {
    // console.log({ data })
    setProgress(10)
    try {
      const res = await addMaleToBreedingEvent(breeding.id, {
        earring: data.earring || '',
        id: data.id || '',
        finishAt: data.finishAt,
        startAt: data.startAt
      })
      setProgress(100)

      console.log(res)
    } catch (error) {
      setProgress(0)
      console.log({ error })
    }
  }

  const principalMale: OtherBreedingMale = {
    earring: breeding.eventData.breedingMale?.earring || '',
    id: breeding.eventData.breedingMale?.id,
    name: breeding.eventData.breedingMale?.name,
    startAt: breeding.eventData.startAt,
    finishAt: breeding.eventData.finishAt
  }
  const otherMales = breeding.eventData.otherMales || []
  const formValues = methods.watch()

  useEffect(() => {
    if (formValues?.startAt) {
      methods.setValue('finishAt', formValues?.startAt)
    }
  }, [formValues?.startAt, methods])

  const [progress, setProgress] = useState(0)
  const disabled = !formValues.earring || !!progress
  const handleRemoveMale = async (index: number) => {
    try {
      const res = await removeMaleFromBreedingEvent(breeding.id, index)
      //console.log({ res })
      return res
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div>
      <button
        className="btn btn-outline btn-sm btn-info "
        onClick={(e) => {
          e.preventDefault()
          handleOpenModalToAddMale()
        }}
      >
        Machos{' '}
        <span className="ml-2">
          <Icon name="edit" size="xs" />
        </span>
      </button>
      <Modal
        title=" Editar machos"
        open={openModalToAddMale}
        handleOpen={handleOpenModalToAddMale}
      >
        <div>
          <h2 className="text-center">Agrega un macho a esta monta.</h2>
          <p className="text-xs">
            <span className="font-bold">Importante! </span>
            No podra haber dos machos al mismo tiempo. Esto para evitar peleas
            dentro del corral y problemas a la hora de los partos tener bien
            definidas las fechas.
          </p>
          <p className="text-xs">
            <span className="font-bold">Recomendación! </span>
            Es buena idea colocar machos muy diferentes o dar un periodo de al
            menos una semana de descanso para que sean mas predecibles los
            partos y poder identificar a las crías con mas certeza.
          </p>

          {/* TODO: Verificar confictos familiares */}
          <MalesTable
            males={[principalMale, ...otherMales]}
            showOps
            handleRemoveMale={handleRemoveMale}
          />

          <div className="">
            <div className="my-8">
              <SearchEarring
                placeholder="Buscar semental"
                filterBy={(animal) => animal?.isStallion}
                onEarringClick={(earring) => handleAddMale(earring)}
              />
            </div>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="flex w-full justify-evenly ">
                  <InputContainer
                    type="date"
                    name="startAt"
                    min={lastMaleFinishAt}
                  />
                  {methods.watch('startAt') && (
                    <InputContainer
                      type="date"
                      name="finishAt"
                      min={methods.watch('startAt')}
                    />
                  )}
                </div>
                <div className="flex w-full justify-center my-10">
                  <ProgressButton progress={progress} disabled={disabled} />
                  {/* <button disabled={disabled} className="mt-8 btn btn-info">
                    Guardar
                  </button> */}
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </Modal>
    </div>
  )
}

const AddEarringTo = ({ breeding }: { breeding: BreedingEventCardDetails }) => {
  const farmAnimals = useSelector(selectFarmAnimals)

  const [openModalToAddEarring, setOpenModalToAddEarring] = useState(false)
  const handleOpenModalToAddEarring = () => {
    setOpenModalToAddEarring(!openModalToAddEarring)
  }
  const handleAddEarring = ({ earring }: { earring: string }) => {
    // console.log({ earring })
    const animal = farmAnimals.find((animal) => animal.earring === earring)
    if (animal) {
      setAnimalsAdded((state) => {
        return [...state, animal]
      })

      addAnimalToBreedingBatchEvent(breeding.id, animal)
    }
    console.log('error finding animal')
  }
  const [animalsAdded, setAnimalsAdded] = useState<any[]>([])
  return (
    <div>
      <button
        className="btn btn-outline btn-sm btn-info "
        onClick={(e) => {
          e.preventDefault()
          handleOpenModalToAddEarring()
        }}
      >
        Hembras{' '}
        <span className="ml-2">
          <Icon name="edit" size="xs" />
        </span>
      </button>
      <Modal
        title="Agregar arete"
        open={openModalToAddEarring}
        handleOpen={handleOpenModalToAddEarring}
      >
        <div>
          <h2>
            Busca aretes que ya esten registrados para agregarlos a esta monta.
            (solo apareceran hembras)
          </h2>
          <div>
            {!!animalsAdded.length && (
              <div>
                <h3>Hembras agregadas</h3>

                {animalsAdded.map(({ id, name, earring }, i) => (
                  <div key={id}>
                    <span>{i + 1}.- </span>
                    <span>
                      {earring} {name || ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="">
            <SearchEarring
              placeholder="Buscar hembras"
              omitEarrings={breeding?.eventData?.breedingBatch?.map(
                (animal: any) => animal?.earring
              )}
              gender="female"
              onEarringClick={(earring) => handleAddEarring(earring)}
              relativeTo={breeding?.eventData?.breedingMale?.earring}
            />
          </div>
          <div>
            {breeding?.eventData?.breedingBatch.map((animal, i) => (
              <AnimalBreedingCardSmall
                key={i}
                animal={{ ...animal, eventData: breeding.eventData }}
                //hiddenEvents={hiddenBirths}
              />
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}
const lastMaleFinishedAt = (
  breeding: BreedingEventCardDetails
): number | Date | string => {
  const otherMales = breeding?.eventData?.otherMales || []
  if (otherMales?.length > 0) {
    const lastMale = otherMales?.sort(
      (a, b) => (b?.finishAt as number) - (a?.finishAt as number)
    )
    //   console.log({ lastDate: myFormatDate(lastMale[0]?.finishAt, 'dd MMM yy') })
    return lastMale[0]?.finishAt
  }
  return breeding.eventData.finishAt
}
export default ModalBreedingOptions
