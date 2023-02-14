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

  const currentFarm = useSelector(selectFarmState)
  const animalsFarm = useSelector(selectFarmAnimals)
  const [progress, setProgress] = useState(0)

  const onSubmit = async (data: any) => {
    setProgress(10)
    console.log({ data })
    return
    try {
      /** Create sell event */
      const res = await createSellEvent({
        status: 'PENDING',
        eventData: data,
        farm: { id: currentFarm?.id || '', name: currentFarm?.name || '' },
        type: 'SELL'
      })
      setProgress(50)
      /** Update animals current status  */
      const animalsSold = data.earrings
      for (let i = 0; i < animalsSold.length; i++) {
        const formAnimal = animalsSold[i]
        const animalId =
          animalsFarm.find(
            (farmAnimal) => farmAnimal.earring === formAnimal.earring
          )?.id || ''

        if (animalId) {
          await updateAnimal(animalId, { currentStatus: 'SOLD' })
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

  const formValues = methods.watch()
  // const totalWeight = formValues.totalWeight || 0
  // const earringsQuantity = formValues.animalsQuantity || 0
  // const averageWeight = earringsQuantity ? totalWeight / earringsQuantity : 0
  // const totalMoney = totalWeight * formValues.price || 0

  // const totalWeightFromEarringForm = formValues?.earrings?.reduce(
  //   (prev: number, curr: EarringWeight) => {
  //     return (prev += curr.weight || 0)
  //   },
  //   0
  // )

  // console.log({ totalWeightFromEarringForm })
  // console.log(formValues)
  const [animalsSelected, setAnimalsSelected] = useState<EarringWeight[]>([])

  // useEffect(() => {
  //   methods.setValue('totalWeight', totalWeightFromEarringForm)
  //   methods.setValue('total', totalMoney)
  //   methods.setValue('animalsQuantity', animalsSelected?.length || 0)
  //   methods.setValue('earrings', animalsSelected)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [methods, animalsSelected, totalWeightFromEarringForm])

  interface EarringWeight {
    earring: string
    weight: number
  }

  useEffect(() => {
    if (sale) {
      setAnimalsSelected(sale.eventData.earrings)
    }
  }, [])

  // useEffect(() => {
  //   if (!sale) {
  //     methods.setValue('total', totalMoney)
  //   }
  // }, [methods, totalMoney, sale])

  // useEffect(() => {
  //   if (!sale) {
  //     methods.setValue('animalsQuantity', animalsSelected?.length || 0)
  //     methods.setValue(
  //       'earrings',
  //       animalsSelected?.map(({ earring }) => {
  //         return { earring }
  //       }) || []
  //     )
  //   }
  // }, [animalsSelected, methods, sale])

  // useEffect(() => {
  //   if (!sale) {
  //     methods.setValue('totalWeight', totalWeightFromEarringForm)
  //   }
  // }, [methods, totalWeightFromEarringForm, sale])
  // console.log({ sale })

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
                handleAddAnimals={(animals) =>
                  setAnimalsSelected(
                    animals?.map((animal) => {
                      return { earring: animal, weight: 0 }
                    }) || []
                  )
                }
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
                          className="input input-bordered input-xs w-full bg-transparent disabled:bg-transparent"
                          {...methods.register(`earrings.${i}.weight`, {
                            valueAsNumber: true
                          })}
                        />
                      </div>
                      <div>
                        <input
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
                        {...field}
                        disabled={isDetailsView}
                        className=" text-end input input-bordered  bg-transparent input-sm w-[80px] disabled:bg-transparent "
                      />
                    </label>
                  )
                }}
              />
              <Controller
                name="totalWeight"
                render={({ field }) => (
                  <label className=" text-end  flex items-center justify-end disabled:bg-transparent">
                    Peso T (kg):
                    <input
                      {...field}
                      disabled={isDetailsView}
                      className=" text-end input input-bordered  bg-transparent input-sm w-[80px] disabled:bg-transparent"
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
                      className=" text-end input input-bordered  bg-transparent disabled:opacity-50 input-sm w-[80px] disabled:bg-opacity-30"
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
                      className=" text-end input  input-bordered  bg-transparent disabled:opacity-50 input-sm  w-[100px] disabled:bg-opacity-30"
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
