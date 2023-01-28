import useSortByField from '@comps/hooks/useSortByField'
import Icon from '@comps/Icon'
import InputContainer from '@comps/inputs/InputContainer'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import HeaderTable from '@comps/MyTables/HeaderTable'
import { current } from '@reduxjs/toolkit'
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
    arraySorted,
    field: fieldSelected,
    ...sortMethods
  } = useSortByField(inventory)

  const farmAnimals = useSelector(selectFarmAnimals)
  interface CompareList {
    earring: string
    currentStatus: any
  }
  const [compareList, setCompareList] = useState<CompareList[]>([])
  const handleCompare = () => {
    let comparative: any[] = []
    arraySorted.forEach(({ earring }) => {
      const animal = farmAnimals.find((animal) => animal.earring === earring)
      if (animal) {
        comparative.push({ earring, currentStatus: animal.currentStatus })
      } else {
        comparative.push({ earring, currentStatus: false })
      }
    })
    setCompareList(comparative)
  }
  return (
    <div>
      <div>
        <h2 className="text-xl font-bold text-center my-2">Inventario</h2>
      </div>
      <div className="">
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="flex justify-center items-end">
            <FormProvider {...methods}>
              <InputContainer
                label="Arete"
                className="w-[80px]"
                name="earring"
                type="text"
              />
              <InputContainer
                label="Comentarios"
                className="w-[200px]"
                name="comments"
                type="text"
              />
              <button className="mx-4 btn btn-sm btn-circle">
                <Icon name="plus" />
              </button>
            </FormProvider>
          </div>
        </form>

        <div className="mt-2">
          <div className="flex items-center ">
            Ordenar:
            <HeaderTable
              fieldSelected={fieldSelected}
              label="Arete"
              fieldName="earring"
              {...sortMethods}
            />
            <HeaderTable
              fieldSelected={fieldSelected}
              label="Comentarios"
              fieldName="comments"
              {...sortMethods}
            />
          </div>
          <div className="flex justify-center">
            <div>
              {arraySorted.map(({ earring, comments }, i) => (
                <div key={i} className="flex  items-center my-1 w-[200px]">
                  <span>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleRemoveEarring(i)
                      }}
                    >
                      <Icon name="close" size="xs" />
                    </button>
                  </span>
                  <span className="mx-2"> {earring} </span>
                  <span className="truncate"> {comments} </span>
                </div>
              ))}
            </div>
            <div>
              {compareList.map(({ earring, currentStatus }, i) => {
                return (
                  <div key={i} className="flex w-full items-center my-1 ">
                    <span className="mx-2">
                      <ModalAnimalDetails size="sm" earring={earring} />{' '}
                    </span>
                    <InventoryAnimalStatus currentStatus={currentStatus} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="flex w-full justify-between">
          <button
            className="btn btn-sm btn-info"
            onClick={(e) => {
              e.preventDefault()
              handleCompare()
            }}
          >
            Guardar inventario
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
        </div>
      </div>
    </div>
  )
}
const InventoryAnimalStatus = ({
  currentStatus
}: {
  currentStatus: string
}) => {
  if (!currentStatus)
    return (
      <span className="text-error flex items-center font-bold">
        <Icon name="info" size="xs" /> <span className="ml-1"></span>
      </span>
    )
  return (
    <div>
      {currentStatus === 'ACTIVE' ? (
        <span className="font-bold text-green-700">
          {animalCurrentStatusLabels[currentStatus]}
        </span>
      ) : (
        <span className="font-bold text-warning">
          {
            animalCurrentStatusLabels[
              (currentStatus as AnimalType['currentStatus']) || 'LOST'
            ]
          }
        </span>
      )}
    </div>
  )
}

export default Inventory
