import AnimalsTable from '@comps/AnimalsTable'
import Icon from '@comps/Icon'
import InputContainer from '@comps/inputs/InputContainer'
import Modal from '@comps/modal'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import SearchEarring from '@comps/SearchEarring'
import { useEffect, useState } from 'react'
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm
} from 'react-hook-form'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import { AnimalType } from 'types/base/AnimalType.model'

interface AnimalSell {
  earring: string
  weight: number
  obs?: string
}

const SellForm = () => {
  const methods = useForm({
    defaultValues: {
      date: new Date(),
      price: 0,
      type: 'onFoot',
      earrings: [] as any[],
      totalWeight: 0,
      averageWeight: 0,
      animals: 0,
      total: 0
    }
  })

  const handleCreatePDF = () => {
    console.log('create pdf')
  }

  const onSubmit = (data: any) => {
    console.log(data)
  }

  const formValues = methods.watch()
  const totalWeight = formValues.totalWeight || 0
  const earringsQuantity = formValues.animals || 0
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
  }, [totalMoney])

  useEffect(() => {
    methods.setValue('animals', animalsSelected?.length || 0)
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
              <h3>Lista de animales</h3>
              <SelectAnimals
                animalsSelected={animalsSelected || []}
                handleAddAnimals={(animals) => setAnimalsSelected(animals)}
              />
              {/* <EarringsArray /> */}
              <div>
                <div className="grid grid-cols-3 ">
                  <div>Arete</div>
                  <div>Peso</div>
                  <div>Obs</div>
                </div>
                {animalsSelected?.map((earring, i) => (
                  <div key={`${earring}-${i}`} className="grid grid-cols-3 ">
                    <div className="flex items-end justify-end">
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
                        {...methods.register(`earrings.${i}.obs`, {
                          valueAsNumber: true
                        })}
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
                name="animals"
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
              {/* <InputContainer
                label="Precio"
                type="number"
                name="price"
                placeholder="0.00"
              />
              <div>Promedio</div>
              <div>Total</div> */}
            </div>
          </div>

          <div className="w-full flex justify-around my-4">
            <button className="btn btn-outline btn-sm">Guardar</button>
            <button
              className="btn btn-outline btn-sm"
              onClick={(e) => {
                e.preventDefault()
                methods.reset()
              }}
            >
              Borrar
            </button>
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
      <button
        className="btn btn-sm btn-outline"
        onClick={(e) => {
          e.preventDefault()
          handleOpenSelectAnimals()
        }}
      >
        Modificar lista
      </button>
    </div>
  )
}

const EarringsArray = () => {
  const { append, fields, remove } = useFieldArray({
    name: 'earrings'
  })

  const handleAddEarring = ({ earring }: { earring: string }) => {
    append({ earring, weight: 0, obs: '' })
  }

  return (
    <div className="my-4 ">
      <SearchEarring
        label="Buscar por arete"
        className=""
        onEarringClick={(earring) => {
          handleAddEarring(earring)
        }}
      />
      <div className="grid grid-cols-3">
        <div>Arete</div>
        <div>Peso</div>
        <div>Ops</div>
      </div>
      {fields.map((field: any, i) => (
        <div key={field.id} className={`grid grid-cols-3 items-center`}>
          <span className="truncate">
            <ModalAnimalDetails earring={field?.earring} size="sm" />
          </span>
          <InputContainer
            className="w-[70px]"
            type="number"
            name={`earrings.${i}.weight`}
          />
          {/* <InputContainer
            className="w-[80px]"
            type="text"
            name={`earrings.${i}.obs`}
          /> */}
          <div className="flex w-full justify-center items-center">
            <button
              className="btn btn-circle btn-xs btn-error btn-outline "
              onClick={(e) => {
                e.preventDefault()
                remove(i)
              }}
            >
              <Icon name="delete" size="xs" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SellForm
