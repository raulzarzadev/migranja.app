import AnimalsTable from 'components/AnimalsTable'
import InputContainer from 'components/inputs/InputContainer'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import HelperText from 'components/HelperText'
import { createGenericBreedingEvent } from '@firebase/Events/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { BreedingDetailsEvent } from 'components/FarmEvents/FarmEvent/FarmEvent.model'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmState } from 'store/slices/farmSlice'
import { ParentsType } from 'types/base/AnimalType.model'
import SearchEarring from '@comps/SearchEarring'
import determinateDeepRelationship from 'utils/determinateDeepRelationship'
import { updateAnimal } from '@firebase/Animal/main'
import Icon from '@comps/Icon'
import useProgress from '@comps/hooks/useProgress'
import ProgressButton from '@comps/ProgressButton'
import AsyncModal from '@comps/modal/AsyncModal'
import Modal from '@comps/modal'
import useModal from '@comps/hooks/useModal'
import { myFormatDate } from 'utils/dates/myDateUtils'

const schema = yup.object().shape({
  breedingMale: yup.string().required('Este campo es necesario*')
})

const BreedingForm = () => {
  const currentFarm = useSelector(selectFarmState)
  const farmAnimals = useSelector(selectFarmAnimals)

  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      breedingMale: '',
      startAt: '',
      finishAt: '',
      batch: ''
    }
  })
  const { handleSubmit, watch, reset, setValue } = methods
  const formValues = watch()
  const males = farmAnimals.filter(({ gender }) => gender === 'male')
  //const females = farmAnimals.filter(({ gender }) => gender === 'female')
  // const malesOptions = males?.map(({ earring, name }) => {
  //   return { label: `${earring}${name ? ` - ${name}` : ''}`, value: earring }
  // })

  const excludeMalesAnimals = (animals: any[]) =>
    animals.filter(({ gender }) => gender === 'female')

  const [sheepSelected, setSheepSelected] = useState<string[] | null>([])
  const { progress, setProgress } = useProgress()
  const onSubmit = async (data: any) => {
    setLoading(true)
    setProgress(10)
    const breedingBatch = femalesFiltered
      ?.filter(({ earring }) => sheepSelected?.includes(earring))
      .map((animal: any) => {
        return { ...animal, status: 'PENDING' }
      })
    const breedingMale: AnimalType | null =
      males?.find(({ earring }) => earring === data.breedingMale) || null
    try {
      setProgress(20)
      // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * Edit breadingBatch animals state
      for (let i = 0; i < breedingBatch.length; i++) {
        const { id } = breedingBatch[i]
        if (id) {
          await updateAnimal(id, { state: 'BREEDING' })
          setProgress(20 + 40 * (i / breedingBatch.length))
        }
      }
      setProgress(60)

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
      setProgress(100)
      setDone(false)
      setLoading(false)
      setDone(true)
    } catch (error) {
      setProgress(-1)
      console.log(error)
      setLoading(false)
    }
    handleClear()
  }

  const modal = useModal()
  const handleClear = () => {
    setSheepSelected([])
    reset()
    setProgress(0)
    setDone(true)
  }
  const [femalesFiltered, setFemaleFiltered] = useState<any[]>([])

  useEffect(() => {
    //const animals = excludeMalesAnimals(farmAnimals)
    const formatAnimalsWithRelationMaleRelation = (
      cattle: { earring: string; parents?: ParentsType }[],
      male: string
    ) => {
      return cattle.map((animal: { earring: string }) => {
        const rel = determinateDeepRelationship(
          male,
          animal.earring,
          cattle.map((animal) => {
            return {
              father: animal.parents?.father?.earring || '',
              mother: animal.parents?.mother?.earring || '',
              name: animal.earring || ''
            }
          })
        )
        if (rel) {
          return { ...animal, relationship: { type: rel, grade: 1 } }
        } else {
          return { ...animal, relationship: null }
        }
      })
    }

    const res = formatAnimalsWithRelationMaleRelation(
      farmAnimals,
      formValues.breedingMale
    )

    setFemaleFiltered(excludeMalesAnimals(res))
  }, [farmAnimals, formValues.breedingMale, sheepSelected])

  useEffect(() => {
    //* Update finish at from the startAt value. It cannot before
    if (formValues?.startAt) {
      setValue('finishAt', formValues?.startAt)
    }
  }, [formValues?.startAt, setValue])
  return (
    <div className="bg-base-300 rounded-md shadow-md  w-full mt-2">
      <div>
        <h3 className="text-xl text-center">Nueva monta</h3>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className=" max-w-sm mx-auto">
          {/* ******************************************** 
                Select bull               
     *******************************************rz */}
          <HelperText
            text="Selecciona las hembras que seran parte de la monta "
            type="info"
          />
          <div className="">
            <SearchEarring
              justStallion
              label="Buscar macho"
              placeholder="Buscar macho"
              gender="male"
              onEarringClick={(e) =>
                methods.setValue('breedingMale', e.earring)
              }
            />
          </div>
          {/* ******************************************** 
                Write the batch name               
     *******************************************rz */}
          <InputContainer
            className=" mx-auto border"
            type="text"
            name="batch"
            label="Lote (opcional)"
          />
          {/* ******************************************** 
                Select Dates               
     *******************************************rz */}

          {formValues.breedingMale && (
            <>
              <HelperText
                text="Selecciona las fechas aproximadas en las que se llevo a cabo la monta"
                type="info"
              />
              <div className="flex w-full justify-between ">
                <InputContainer type="date" name="startAt" label="Desde" />

                {formValues?.startAt && (
                  <InputContainer
                    type="date"
                    name="finishAt"
                    label="Hasta"
                    min={formValues?.startAt}
                    className="w-full"
                  />
                )}
              </div>
            </>
          )}

          {/* ******************************************** 
                Select females               
       *******************************************rz */}
          {sheepSelected?.map((earring) => (
            <div key={earring}>
              {earring}{' '}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  const aux = sheepSelected.filter((str) => str !== earring)
                  setSheepSelected(aux)
                }}
                className="text-error"
              >
                <Icon name="delete" size="xs" />
              </button>
            </div>
          ))}
          {formValues.finishAt && formValues.startAt && (
            <SearchEarring
              onEarringClick={(animal) => {
                if (
                  !!animal.earring &&
                  !sheepSelected?.includes(animal.earring)
                )
                  setSheepSelected([...(sheepSelected || []), animal.earring])
              }}
              relativeTo={formValues.breedingMale}
              label="Buscar hembras"
              filterBy={(animal) => animal.gender === 'female'}
              omitEarrings={sheepSelected || []}
            />
          )}
          {/* {formValues.finishAt && formValues.startAt && (
            <div className=" sm:max-w-full">
              <HelperText
                text="Selecciona las hembras que seran parte de la monta. Debes seleccionar al menos una"
                type="info"
              />
              <AnimalsTable
                showRelationshipCol
                animalsData={femalesFiltered || []}
                setSelectedRows={setSheepSelected}
                settings={{ selectMany: true }}
                showSelectRow
              />
            </div>
          )} */}
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
              <button
                className="btn btn-info "
                onClick={(e) => {
                  e.preventDefault()
                  modal.handleOpen()
                }}
              >
                Crear monta
              </button>
              // <button disabled={loading} className="btn btn-success">
              //   Crear Monta
              // </button>
            )}
            <Modal {...modal} title="Crear monta">
              <div className="text-center">
                <h4 className="font-bold">Crear monta</h4>
                <p>Del: {myFormatDate(formValues.startAt, 'dd MMM yy')}</p>
                <p>Al: {myFormatDate(formValues.finishAt, 'dd MMM yy')}</p>
                <p className="font-bold">Macho: {formValues.breedingMale}</p>
                {formValues.batch && (
                  <p className="font-bold">Lote: {formValues.batch}</p>
                )}
                {sheepSelected?.map((earring) => (
                  <div key={earring}>
                    {earring}{' '}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        const aux = sheepSelected.filter(
                          (str) => str !== earring
                        )
                        setSheepSelected(aux)
                      }}
                      className="text-error"
                    >
                      <Icon name="delete" size="xs" />
                    </button>
                  </div>
                ))}
              </div>
              {done ? (
                <span>Monta creada</span>
              ) : (
                <ProgressButton buttonLabel="Crear monta" progress={progress} />
              )}
            </Modal>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default BreedingForm
