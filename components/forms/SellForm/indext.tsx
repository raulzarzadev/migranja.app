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
import { AnimalType } from 'types/base/AnimalType.model'

const SellForm = () => {
  const methods = useForm({
    defaultValues: {
      date: new Date(),
      price: 0,
      type: 'onFoot',
      earrings: [] as any[],
      totalWeight: 0,
      averageWeight: 0,
      animalsQuantity: 0,
      total: 0
    }
  })

  const currentFarm = useSelector(selectFarmState)
  const animalsFarm = useSelector(selectFarmAnimals)
  const [progress, setProgress] = useState(0)
  const onSubmit = async (data: any) => {
    setProgress(10)
    console.log(data)
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
      debugger
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
  const totalWeight = formValues.totalWeight || 0
  const earringsQuantity = formValues.animalsQuantity || 0
  const averageWeight = earringsQuantity ? totalWeight / earringsQuantity : 0
  const totalMoney = formValues?.totalWeight * formValues.price || 0

  const totalWeightFromEarringForm = formValues?.earrings?.reduce(
    (prev, curr) => {
      return (prev += curr.weight || 0)
    },
    0
  )

  const [animalsSelected, setAnimalsSelected] = useState<any[] | null>([])

  useEffect(() => {
    methods.setValue('total', totalMoney)
  }, [methods, totalMoney])

  useEffect(() => {
    methods.setValue('animalsQuantity', animalsSelected?.length || 0)
    methods.setValue(
      'earrings',
      animalsSelected?.map((earring: string) => {
        return { earring }
      }) || []
    )
  }, [animalsSelected, methods])

  useEffect(() => {
    methods.setValue('totalWeight', totalWeightFromEarringForm)
  }, [methods, totalWeightFromEarringForm])

  return (
    <div>
      <h2 className="text-xl font-bold">Nueva venta</h2>
      <FormProvider {...methods}>
        <form
          autoComplete="off"
          onSubmit={methods.handleSubmit(onSubmit)}
          className="w-[290px] sm:w-full"
        >
          <div className="grid gap-2 max-w-sm mx-auto">
            <InputContainer
              label="Tipo"
              type="select"
              name="type"
              selectOptions={[
                { label: 'En pie', value: 'onFoot' },
                { label: 'En canal', value: 'onCarcass' }
              ]}
            />
            <InputContainer label="Fecha" type="date" name="date" />
          </div>
          <div className="sm:flex">
            <div className="sm:w-full text-center ">
              <SelectAnimals
                animalsSelected={animalsSelected || []}
                handleAddAnimals={(animals) => setAnimalsSelected(animals)}
              />
              <div>
                <div className="grid grid-cols-[80px_100px_auto] ">
                  <div>Arete</div>
                  <div>Peso</div>
                  <div>Obs</div>
                </div>
                {animalsSelected?.map((earring, i) => (
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
                        className="input input-bordered input-xs w-full"
                        {...methods.register(`earrings.${i}.weight`, {
                          valueAsNumber: true
                        })}
                      />
                    </div>
                    <div>
                      <input
                        className="input input-bordered input-xs w-full"
                        {...methods.register(`earrings.${i}.obs`)}
                      />
                    </div>
                  </div>
                ))}
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
                      className=" text-end input input-outline input-sm w-[80px] "
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
                        className=" text-end input input-outline input-sm w-[80px] "
                      />
                    </label>
                  )
                }}
              />
              <Controller
                name="totalWeight"
                render={({ field }) => (
                  <label className=" text-end  flex items-center justify-end">
                    Peso T (kg):
                    <input
                      {...field}
                      className=" text-end input input-outline input-sm w-[80px]"
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
                      value={parseFloat(`${averageWeight}`).toFixed(2)}
                      disabled
                      className=" text-end input input-outline input-sm w-[80px]"
                    />
                  </label>
                )}
              />
              <Controller
                name="total"
                render={({ field }) => (
                  <label className="flex items-center justify-end">
                    Total ($):
                    <input
                      {...field}
                      value={`${new Intl.NumberFormat('es-Mx').format(
                        totalMoney
                      )}`}
                      disabled
                      className=" text-end input input-outline input-sm  w-[80px]"
                    />
                  </label>
                )}
              />
            </div>
          </div>

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
              Borrar
            </button>
            <ProgressButton
              progress={progress}
              className="btn-outline btn-sm"
            />
            {/* <button className="btn btn-outline btn-sm">Guardar</button> */}
          </div>
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
