import AnimalsTable from '@comps/AnimalsTable'
import InputContainer from '@comps/inputs/InputContainer'
import Modal from '@comps/modal'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import ProgressButton from '@comps/ProgressButton'
import { updateAnimal } from '@firebase/Animal/main'
import { createSellEvent } from '@firebase/Events/sellEvent.event'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmState } from 'store/slices/farmSlice'
import { AnimalState } from 'types/base/AnimalState.model'
interface EarringWeight {
  earring: string
  weight: number
}
const SellForm = ({ sale }: { sale?: any }) => {
  //* will determinate text and inputs statuses
  const isDetailsView = !!sale
  const defaultValues = isDetailsView
    ? sale?.eventData
    : {
        date: new Date(),
        price: 0,
        type: 'onFoot',
        earrings: [] as any[],
        totalWeight: 0,
        averageWeight: 0,
        animalsQuantity: 0,
        total: 0
      }

  const methods = useForm({
    defaultValues
  })
  const formValues = methods.watch()
  const totalWeightFromEarringForm = formValues?.earrings?.reduce(
    (prev: number, curr: EarringWeight) => {
      return (prev += curr.weight || 0)
    },
    0
  )

  const currentFarm = useSelector(selectFarmState)
  const animalsFarm = useSelector(selectFarmAnimals)
  const [progress, setProgress] = useState(0)

  const onSubmit = async (data: any) => {
    setProgress(10)
    // console.log({ data })
    // return
    try {
      /** Create sell event */
      const res = await createSellEvent({
        status: 'PENDING',
        eventData: data,
        farm: { id: currentFarm?.id || '', name: currentFarm?.name || '' },
        type: 'SELL'
      })
      setProgress(50)
      /** Update animals current status  and state */
      const animalsSold = data.earrings
      for (let i = 0; i < animalsSold.length; i++) {
        const formAnimal = animalsSold[i]
        const animalId =
          animalsFarm.find(
            (farmAnimal) => farmAnimal.earring === formAnimal.earring
          )?.id || ''

        if (animalId) {
          await updateAnimal(animalId, {
            currentStatus: 'SOLD',
            state: 'SOLD'
          })
          setProgress(50 + (40 * (i + 1)) / animalsSold.length)
        } else {
          console.log('not found')
        }
      }
      setProgress(100)
      methods.reset()

      console.log(res)
    } catch (error) {
      setProgress(0)
      console.log(error)
    }
  }

  const [animalsSelected, setAnimalsSelected] = useState<EarringWeight[]>([])

  useEffect(() => {
    //* Just render the first time if has default selected animals
    setAnimalsSelected(formValues.earrings)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (animalsSelected.length) {
      methods.setValue('totalWeight', totalWeightFromEarringForm)
    }
    methods.setValue('animalsQuantity', animalsSelected.length)
  }, [animalsSelected.length, methods, totalWeightFromEarringForm])

  const areAnimalsSelected = !!animalsSelected.length
  useEffect(() => {
    const totalPrice = formValues.price * formValues.totalWeight
    const averageWeight =
      parseInt(formValues.animalsQuantity) === 0
        ? 0
        : formValues.totalWeight / formValues.animalsQuantity
    methods.setValue('total', totalPrice)
    methods.setValue('averageWeight', averageWeight)
  }, [
    formValues.animalsQuantity,
    formValues.totalWeight,
    formValues.price,
    methods,
    totalWeightFromEarringForm,
    areAnimalsSelected,
    animalsSelected
  ])
  const handleSetAnimalsSelected = (animals: string[] | null) => {
    setAnimalsSelected(
      animals?.map((animal) => {
        return { earring: animal, weight: 0 }
      }) || []
    )
  }

  useEffect(() => {
    methods.setValue('earrings', animalsSelected)
  }, [animalsSelected, methods])

  // console.log({ animalsSelected })
  // console.log(formValues.earrings)

  return (
    <div>
      <h2 className="text-xl font-bold text-center">
        {isDetailsView ? 'Detalles de venta' : 'Nueva venta'}
      </h2>
      <FormProvider {...methods}>
        <form
          autoComplete="off"
          onSubmit={methods.handleSubmit(onSubmit)}
          className=" sm:w-full"
        >
          <div className="grid gap-2 max-w-sm mx-auto">
            <InputContainer
              inputClassName="disabled:bg-transparent"
              disabled={isDetailsView}
              label="Tipo"
              type="select"
              name="type"
              selectOptions={[
                { label: 'En pie', value: 'onFoot' },
                { label: 'En canal', value: 'onCarcass' }
              ]}
            />
            <InputContainer
              inputClassName="disabled:bg-transparent"
              disabled={isDetailsView}
              label="Fecha"
              type="date"
              name="date"
            />
          </div>
          <div className="sm:flex">
            <div className="sm:w-full text-center ">
              <SelectAnimals
                animalsSelected={animalsSelected || []}
                handleAddAnimals={handleSetAnimalsSelected}
              />
              <div>
                <div className="grid grid-cols-[80px_100px_auto] ">
                  <div>Arete</div>
                  <div>Peso</div>
                  <div>Obs</div>
                </div>
                <div className="grid gap-1">
                  {animalsSelected?.map(({ earring }, i) => (
                    <div
                      key={`${earring}-${i}`}
                      className="grid grid-cols-[80px_100px_auto] "
                    >
                      <div className="flex items-end justify-between pl-4">
                        <span className="text-sm">{i + 1}</span>
                        <span className="whitespace-nowrap truncate">
                          <ModalAnimalDetails earring={earring} size="sm" />
                        </span>
                      </div>
                      <div>
                        <input
                          disabled={isDetailsView}
                          type={'number'}
                          step={0.01}
                          defaultValue={0}
                          className="input input-bordered input-xs w-full bg-transparent disabled:bg-transparent"
                          {...methods.register(`earrings.${i}.weight`, {
                            valueAsNumber: true
                          })}
                        />
                      </div>
                      <div>
                        <input
                          defaultValue={''}
                          disabled={isDetailsView}
                          className="input input-bordered input-xs w-full bg-transparent disabled:bg-transparent"
                          {...methods.register(`earrings.${i}.obs`)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid sm:w-1/2 gap-2 my-2 text-sm h-min min-w-[200px]">
              <Controller
                name="price"
                render={({ field }) => (
                  <label className=" flex items-center justify-end">
                    Precio (kg):
                    <input
                      type={'number'}
                      {...field}
                      disabled={isDetailsView}
                      className=" text-end input input-sm w-[80px] input-bordered  bg-transparent disabled:bg-transparent"
                    />
                  </label>
                )}
              />
              <Controller
                name="animalsQuantity"
                render={({ field }) => {
                  return (
                    <label className=" flex items-center justify-end">
                      Animales (N°):
                      <input
                        type={'number'}
                        {...field}
                        disabled={isDetailsView || areAnimalsSelected}
                        className=" text-end input input-bordered  bg-transparent input-sm w-[80px] disabled:bg-transparent disabled:border-transparent "
                      />
                    </label>
                  )
                }}
              />
              <Controller
                name="totalWeight"
                render={({ field }) => (
                  <label className=" text-end  flex items-center justify-end disabled:bg-transparent ">
                    Peso T (kg):
                    <input
                      {...field}
                      type="number"
                      disabled={isDetailsView || areAnimalsSelected}
                      className=" text-end input input-bordered  bg-transparent input-sm w-[80px] disabled:bg-transparent disabled:border-transparent"
                    />
                  </label>
                )}
              />
              <Controller
                name="averageWeight"
                render={({ field }) => (
                  <label className="flex items-center justify-end">
                    Peso % (kg):
                    <input
                      {...field}
                      value={parseFloat(`${field.value}`).toFixed(2)}
                      disabled
                      className=" text-end input input-bordered   input-sm w-[80px]  disabled:border-transparent disabled:bg-transparent "
                    />
                  </label>
                )}
              />
              <Controller
                name="total"
                render={({ field }) => (
                  <label className="flex items-center justify-end ">
                    Total ($):
                    <input
                      {...field}
                      value={`${new Intl.NumberFormat('es-Mx').format(
                        field.value
                      )}`}
                      disabled
                      className=" text-end input  input-bordered font-bold  input-sm  w-[100px] disabled:border-transparent disabled:bg-transparent "
                    />
                  </label>
                )}
              />
            </div>
          </div>
          {!sale && (
            <div className="w-full flex justify-around my-4">
              <button
                className="btn btn-outline btn-sm"
                onClick={(e) => {
                  e.preventDefault()
                  methods.reset()
                  setProgress(0)
                  setAnimalsSelected([])
                }}
              >
                Limpiar
              </button>
              <ProgressButton
                progress={progress}
                className="btn-outline btn-sm"
              />
              {/* <button className="btn btn-outline btn-sm">Guardar</button> */}
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  )
}

const SelectAnimals = ({
  animalsSelected = [],
  handleAddAnimals = () => {}
}: {
  animalsSelected: any[]
  handleAddAnimals: (animals: string[] | null) => void
}) => {
  const [openSelectAnimals, setOpenSelectAnimals] = useState(false)
  const handleOpenSelectAnimals = () => {
    setOpenSelectAnimals(!openSelectAnimals)
  }
  const farmAnimals = useSelector(selectFarmAnimals)
  return (
    <div>
      <button
        className="link my-5 underline-offset-4"
        onClick={(e) => {
          e.preventDefault()
          handleOpenSelectAnimals()
        }}
      >
        Lista de animales
      </button>
      <Modal
        open={openSelectAnimals}
        handleOpen={handleOpenSelectAnimals}
        title="Seleccionar animales para venta"
      >
        <h4>Seleccionar animales para agregar a la lista </h4>

        <AnimalsTable
          showSelectRow
          selectedRows={animalsSelected}
          animalsData={farmAnimals}
          setSelectedRows={(rows) => handleAddAnimals(rows)}
        />
      </Modal>
    </div>
  )
}

export default SellForm
