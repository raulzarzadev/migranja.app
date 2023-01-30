import Box from '@comps/Basics/Box'
import P from '@comps/Basics/Paragraph'
import H4 from '@comps/Basics/SubTitle'
import useSortByField from '@comps/hooks/useSortByField'
import Icon from '@comps/Icon'
import InputContainer from '@comps/inputs/InputContainer'
import Modal from '@comps/modal'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import HeaderTable from '@comps/MyTables/HeaderTable'
import { createInventory } from '@firebase/Inventories/main'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { selectAuthState } from 'store/slices/authSlice'
import { selectFarmAnimals, selectFarmState } from 'store/slices/farmSlice'
import {
  Inventory,
  InventoryDetails,
  InventoryStock
} from 'types/base/Inventory.model'

const INVENTORY_LOCAL_STORAGE = 'sheep-inventory'
const InventoryForm = ({
  animalsIds,
  inventoryType
}: {
  animalsIds?: string[]
  inventoryType?: string
}) => {
  const methods = useForm()
  const [inventory, setInventory] = useState<any[]>([])
  useEffect(() => {
    setInventory(
      JSON.parse(localStorage.getItem(INVENTORY_LOCAL_STORAGE) || '[]')
    )
  }, [])

  const onSubmit = (data: any) => {
    setSaveDisabled(true)
    addItemToLocalStorage(
      { earring: data?.earring, comments: data?.comments || '' },
      INVENTORY_LOCAL_STORAGE
    )
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

  const handleRemoveIndex = (index: number) => {
    removeItemToLocalStorage(index, INVENTORY_LOCAL_STORAGE)
  }

  const { arraySorted: physicalStock, field: fieldSelected } =
    useSortByField(inventory)

  const farmAnimals = useSelector(selectFarmAnimals)

  useEffect(() => {
    if (animalsIds) {
      const predefinedAnimals = farmAnimals
        .filter(({ id }) => animalsIds.includes(id))
        .map(({ earring, currentStatus }) => {
          return { earring, comments: currentStatus || '' }
        })
      // console.log({ predefinedAnimals })
      setFullStock(predefinedAnimals)
      setAppStock(predefinedAnimals)
    } else {
      const allAnimals = farmAnimals
        //.filter(({ currentStatus }) => currentStatus === 'ACTIVE')
        .map(({ earring, currentStatus }) => {
          return { earring, comments: currentStatus || '' }
        })

      setFullStock(allAnimals)
      setAppStock(allAnimals.filter(({ comments }) => comments === 'ACTIVE'))
    }
  }, [animalsIds, farmAnimals])

  const [fullStock, setFullStock] = useState<InventoryStock[]>([])
  const [appStock, setAppStock] = useState<InventoryStock[]>([])
  const [stockDifferences, setStockDifferences] = useState<InventoryStock[]>([])
  const [stockMissed, setStockMissed] = useState<InventoryStock[]>([])
  const [stockCoincidences, setStockCoincidences] = useState<InventoryStock[]>(
    []
  )
  const handleCompare = () => {
    setSaveDisabled(false)
    let coincidences: InventoryStock[] = []
    let difference: InventoryStock[] = []
    let missed: InventoryStock[] = []
    //* active farm animals are the current app stock
    //* fullStock is all farm animals have been existend in app

    physicalStock.forEach((physicalAnimal) => {
      //* animal in the physical list exist in fullStock push the animal in coincidence list
      const physicalAnimalExists = fullStock.find(
        ({ earring }) => physicalAnimal.earring === earring
      )
      if (physicalAnimalExists) {
        //* animal in the physical list exist in appStock push the animal in coincidence list
        coincidences.push(physicalAnimalExists)
      } else {
        //* animal in the physical list NOT exists in app stock push the animal in differences list
        difference.push(physicalAnimal)
      }
    })
    appStock.forEach((appAnimal) => {
      //* animal in the appStock that  NOT appear in the physical list push in missed list
      const appAnimalFound = physicalStock.find(
        ({ earring }) => earring === appAnimal.earring
      )
      if (appAnimalFound) {
        // do nothing because is already found
      } else {
        //* add to missed list
        missed.push(appAnimal)
      }
    })
    setStockDifferences(difference)
    setStockMissed(missed)
    setStockCoincidences(coincidences)
  }
  const handleClean = () => {
    setInventory([])
    setStockDifferences([])
    setStockMissed([])
    setStockCoincidences([])
    localStorage.setItem(INVENTORY_LOCAL_STORAGE, JSON.stringify([]))
  }

  const user = useSelector(selectAuthState)
  const farm = useSelector(selectFarmState)

  const handleSave = async () => {
    setSaveDisabled(true)
    try {
      const newInventory: Inventory = {
        createdBy: {
          userId: user?.id || '',
          name: user?.name || user?.displayName || ''
        },
        type: inventoryType || 'full',
        description: '',
        farm: {
          id: farm?.id || '',
          name: farm?.name || ''
        },
        date: new Date(),
        physicalStock,
        stockDifferences,
        stockCoincidences,
        stockMissed
      }

      const res = await createInventory(newInventory)
      console.log({ res })
    } catch (error) {
      console.log({ error })
    }
  }

  const [saveDisabled, setSaveDisabled] = useState(true)

  return (
    <div>
      <div>
        <h2 className="text-xl font-bold text-center my-2">Inventario</h2>
      </div>
      <div className="">
        <div className="flex justify-center  flex-col ">
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormProvider {...methods}>
              <div className="grid gap-4 my-2 mb-10 sm:grid-cols-3 items-end">
                <InputContainer
                  rules={{ required: 'Es necesario' }}
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
          </form>

          <div className="grid gap-4 my-2  sm:grid-cols-3">
            <button
              className="btn btn-sm btn-info"
              onClick={(e) => {
                e.preventDefault()
                handleSave()
              }}
              disabled={saveDisabled}
            >
              Guardar <Icon name="save" />
            </button>
            <button
              className={`btn btn-sm btn-success  ${
                saveDisabled &&
                !!inventory.length &&
                ' animate-bounce temporary-bounce'
              } `}
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
          <InventoryInfo
            physicalStock={physicalStock}
            stockCoincidences={stockCoincidences}
            stockDifferences={stockDifferences}
            stockMissed={stockMissed}
            handleRemoveIndex={handleRemoveIndex}
          />
        </div>
      </div>
    </div>
  )
}
interface InventoryInfoType {
  physicalStock: InventoryStock[]
  stockCoincidences: InventoryStock[]
  stockDifferences: InventoryStock[]
  stockMissed: InventoryStock[]
  handleRemoveIndex?: (index: number) => void
}
export const InventoryInfo = ({
  physicalStock,
  stockCoincidences,
  stockDifferences,
  stockMissed,
  handleRemoveIndex
}: InventoryInfoType) => {
  return (
    <div className="grid gap-4 my-4 text-center sm:grid-cols-3 items-stretch">
      <SquareResult
        animals={physicalStock}
        title="Fisicas"
        description="Lista de existencias reales. "
        onRemoveIndex={handleRemoveIndex}
      />
      <SquareResult
        animals={stockCoincidences}
        title="Coincidencias"
        description="Existen en la app (todas) y en el registro real"
      />
      <SquareResult
        animals={stockDifferences}
        title="Diferencias"
        description="Existen en real pero NO en la app"
      />
      <SquareResult
        animals={stockMissed}
        title="Faltantes"
        description="Existen en la app (activas) pero NO en el registro real"
      />
    </div>
  )
}
export interface SquareResultType {
  animals: InventoryStock[]
  title: string
  description?: string
  onRemoveIndex?: (index: number) => void
}
const SquareResult = ({
  animals,
  title,
  description,
  onRemoveIndex
}: SquareResultType) => {
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        handleOpenModal()
      }}
    >
      <Box>
        <H4>{title}</H4>
        <P>{animals.length || 0}</P>
      </Box>
      <Modal title={title} open={openModal} handleOpen={handleOpenModal}>
        <>
          <H4>{title}</H4>
          <p className="italic text-sm">{description}</p>
          <AnimalColTable
            onDelete={onRemoveIndex}
            commentTitle="Comentarios"
            animals={animals}
          />
        </>
      </Modal>
    </button>
  )
}

const AnimalColTable = ({
  animals = [],
  commentTitle = '',
  onDelete
}: {
  animals: any[]
  commentTitle: string
  onDelete?: (index: number) => void
}) => {
  const { arraySorted, ...sortMethods } = useSortByField(animals)
  return (
    <div className=" overflow-auto justify-center flex w-full ">
      <table className="bg-base-100 text-center ">
        <thead className="sticky top-0  ">
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

export default InventoryForm
