import Box from '@comps/Basics/Box'
import P from '@comps/Basics/Paragraph'
import H4 from '@comps/Basics/SubTitle'
import useSortByField from '@comps/hooks/useSortByField'
import Icon from '@comps/Icon'
import InputContainer from '@comps/inputs/InputContainer'
import Modal from '@comps/modal'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import HeaderTable from '@comps/MyTables/HeaderTable'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import { AnimalType } from 'types/base/AnimalType.model'
import { animalCurrentStatusLabels } from 'types/base/LABELS_TYPES/AnimalCurrentStatus'

const INVENTORY_LOCAL_STORAGE = 'sheep-inventory'
const Inventory = () => {
  const methods = useForm()
  const [inventory, setInventory] = useState<any[]>([])

  useEffect(() => {
    setInventory(
      JSON.parse(localStorage.getItem(INVENTORY_LOCAL_STORAGE) || '[]')
    )
  }, [])

  const onSubmit = (data: any) => {
    addItemToLocalStorage(data, INVENTORY_LOCAL_STORAGE)
    methods.reset()
  }

  const addItemToLocalStorage = (item: any, itemName: string) => {
    const inventory = JSON.parse(localStorage.getItem(itemName) || '[]')
    inventory.unshift({ ...item })
    setInventory(inventory)
    localStorage.setItem(itemName, JSON.stringify(inventory))
  }

  const removeItemToLocalStorage = (index: number, itemName: string) => {
    const inventory: any[] = JSON.parse(localStorage.getItem(itemName) || '[]')
    inventory.splice(index, 1)
    setInventory(inventory)
    localStorage.setItem(itemName, JSON.stringify(inventory))
  }

  const handleRemoveEarring = (index: number) => {
    removeItemToLocalStorage(index, INVENTORY_LOCAL_STORAGE)
  }

  const {
    arraySorted: animalsInReal,
    field: fieldSelected,
    ...sortMethods
  } = useSortByField(inventory)

  const farmAnimals = useSelector(selectFarmAnimals)
  interface CompareList {
    earring: string
    comments: any
  }
  const [compareList, setCompareList] = useState<CompareList[]>([])
  const [missAnimals, setMissAnimals] = useState<CompareList[]>([])
  const handleCompare = () => {
    let comparative: any[] = []
    let missAnimals: any[] = []
    const activeAnimals = farmAnimals.filter(
      ({ currentStatus }) => currentStatus === 'ACTIVE'
    )
    activeAnimals.forEach(({ earring, currentStatus }) => {
      const animalExist = animalsInReal.find(
        (animalInventory) => animalInventory.earring === earring
      )
      if (!animalExist)
        missAnimals.push({
          earring,
          comments: animalCurrentStatusLabels[currentStatus || 'MISSED']
        })
    })

    animalsInReal.forEach(({ earring }) => {
      const animal = farmAnimals.find((animal) => animal.earring === earring)
      if (animal) {
        comparative.push({
          earring,
          comments: animalCurrentStatusLabels[animal?.currentStatus || 'MISSED']
        })
      } else {
        comparative.push({ earring, comments: 'MISSED' })
      }
    })
    setMissAnimals(missAnimals)
    setCompareList(comparative)
  }
  const handleClean = () => {
    setInventory([])
    setCompareList([])
    setMissAnimals([])
    localStorage.setItem(INVENTORY_LOCAL_STORAGE, JSON.stringify([]))
  }
  const handleSave = () => {
    console.log({ missAnimals, animalsInReal, compareList })
  }
  const [openInventory, setOpenInventory] = useState(false)
  const handleOpenInventory = () => {
    setOpenInventory(!openInventory)
  }
  const [openCoincidence, setOpenCoincidence] = useState(false)
  const handleOpenCoincidence = () => {
    setOpenCoincidence(!openCoincidence)
  }
  const [openMissed, setOpenMissed] = useState(false)
  const handleOpenMissed = () => {
    setOpenMissed(!openMissed)
  }

  return (
    <div>
      <div>
        <h2 className="text-xl font-bold text-center my-2">Inventario</h2>
      </div>
      <div className="">
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="flex justify-center  flex-col ">
            <FormProvider {...methods}>
              <div className="grid gap-4 my-2 mb-10 sm:grid-cols-3 items-end">
                <InputContainer
                  label="Arete"
                  className="w-full"
                  name="earring"
                  type="text"
                />
                <InputContainer
                  label="Comentarios"
                  className=""
                  name="comments"
                  type="text"
                />
                <button className="btn btn-sm    ">
                  <span className="">Agregar</span> <Icon name="plus" />
                </button>
              </div>
            </FormProvider>
            <div className="grid gap-4 my-2  sm:grid-cols-3">
              <button
                className="btn btn-sm btn-info"
                onClick={(e) => {
                  e.preventDefault()
                  handleSave()
                }}
                disabled
              >
                Guardar <Icon name="save" />
              </button>
              <button
                className="btn btn-sm btn-success"
                onClick={(e) => {
                  e.preventDefault()
                  handleCompare()
                }}
              >
                Comparar
              </button>
              <button
                className="btn btn-sm btn-outline"
                onClick={(e) => {
                  e.preventDefault()
                  handleClean()
                }}
              >
                Limpiar
              </button>
            </div>
            <div className="grid gap-4 my-4 text-center sm:grid-cols-3 items-stretch">
              <button
                className=""
                onClick={(e) => {
                  e.preventDefault()
                  handleOpenInventory()
                }}
              >
                <Box>
                  <H4>Existencia</H4>
                  <P>{animalsInReal.length || 0}</P>
                </Box>
                <Modal
                  title="Existencias "
                  handleOpen={handleOpenInventory}
                  open={openInventory}
                >
                  <div>
                    <AnimalColTable
                      title="Existencia"
                      commentTitle="Comentarios"
                      animals={animalsInReal}
                      onDelete={handleRemoveEarring}
                    />
                  </div>
                </Modal>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleOpenCoincidence()
                }}
              >
                <Box>
                  <H4>Coincidencias</H4>
                  <P>
                    {
                      compareList.filter(
                        ({ comments }) => comments !== 'MISSED'
                      ).length
                    }
                  </P>
                  <H4>Sobrantes</H4>
                  <P>
                    {
                      compareList.filter(
                        ({ comments }) => comments === 'MISSED'
                      ).length
                    }
                  </P>
                </Box>
                <Modal
                  title="Coincidecias"
                  open={openCoincidence}
                  handleOpen={handleOpenCoincidence}
                >
                  <>
                    <AnimalColTable
                      title="Coincidencias"
                      commentTitle="Status"
                      animals={compareList}
                    />
                  </>
                </Modal>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleOpenMissed()
                }}
              >
                <Box>
                  <H4>Faltantes</H4>
                  <P>{missAnimals.length || 0}</P>
                </Box>
                <Modal
                  title="Faltantes"
                  open={openMissed}
                  handleOpen={handleOpenMissed}
                >
                  <>
                    <AnimalColTable
                      title="Faltantes"
                      commentTitle="Status"
                      animals={missAnimals}
                    />
                  </>
                </Modal>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

const AnimalColTable = ({
  animals = [],
  commentTitle = '',
  title = '',
  onDelete
}: {
  animals: any[]
  commentTitle: string
  title: string
  onDelete?: (index: number) => void
}) => {
  const { arraySorted, ...sortMethods } = useSortByField(animals)
  return (
    <div className=" overflow-auto justify-center flex w-full ">
      <table className="bg-base-100 text-center ">
        <thead className="sticky top-0  ">
          <tr className=" w-full bg-base-100 ">
            <th className="p-2" colSpan={2}>
              {title}
            </th>
          </tr>
          <tr className="bg-base-100">
            <th className="p-2">
              <HeaderTable label="Arete" fieldName="earring" {...sortMethods} />
            </th>
            <th className="p-2">
              <HeaderTable
                label={commentTitle}
                fieldName="comments"
                {...sortMethods}
              />
            </th>
          </tr>
        </thead>
        <tbody className="">
          {arraySorted.map(({ earring, comments }, i) => (
            <tr className="h-8" key={i}>
              <td className="text-start px-2">
                <span>
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        onDelete?.(i)
                      }}
                    >
                      <Icon name="close" size="xs" />
                    </button>
                  )}
                </span>
                <ModalAnimalDetails earring={earring} size="normal" />
              </td>
              <td className="">
                <InventoryAnimalStatus comment={comments} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const InventoryAnimalStatus = ({ comment }: { comment: string }) => {
  if (!comment)
    return <span className="text-error flex items-center font-bold"></span>
  return (
    <div className="max-w-[100px] truncate">
      {comment === 'MISSED' ? (
        <div className="flex w-full justify-center">
          <Icon name="info" size="xs" />
        </div>
      ) : (
        <span className="font-bold text-green-700 ">{comment}</span>
      )}
    </div>
  )
}

export default Inventory
