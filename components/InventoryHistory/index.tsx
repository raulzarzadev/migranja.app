import Box from '@comps/Basics/Box'
import H1 from '@comps/Basics/Title1'
import { InventoryInfo } from '@comps/InventoryForm'
import Modal from '@comps/modal'
import ModalDelete from '@comps/modal/ModalDelete'
import {
  deleteInventory,
  listenFarmInventories
} from '@firebase/Inventories/main'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { InventoryDetails } from 'types/base/Inventory.model'
import { fromNow } from 'utils/dates/myDateUtils'

const InventoryHistory = () => {
  const [inventories, setInventories] = useState<InventoryDetails[]>([])
  const {
    query: { farmId }
  } = useRouter()
  useEffect(() => {
    listenFarmInventories(farmId as string, setInventories)
  }, [farmId])
  return (
    <div className="w-full">
      <H1>Inventarios</H1>

      <div className="grid gap-4 ">
        {inventories.map((inventory, i) => (
          <InventoryCard key={i} inventory={inventory} />
        ))}
      </div>
    </div>
  )
}
const InventoryCard = ({ inventory }: { inventory: InventoryDetails }) => {
  const {
    id,
    type,
    date,
    createdBy,
    physicalStock,
    description,
    stockDifferences,
    stockCoincidences,
    stockMissed
  } = inventory
  const [openDetails, setOpenDetails] = useState(false)
  const handleOpenDetails = () => {
    setOpenDetails(!openDetails)
  }
  const handleDeleteInventory = async (id: string) => {
    try {
      const res = await deleteInventory(id)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box>
      <Modal
        open={openDetails}
        handleOpen={handleOpenDetails}
        title="Detalles "
      >
        <div>
          <InventoryInfo
            physicalStock={inventory.physicalStock}
            stockCoincidences={inventory.stockCoincidences}
            stockDifferences={inventory.stockDifferences}
            stockMissed={inventory.stockMissed}
          />
          <div>
            <ModalDelete
              handleDelete={() => handleDeleteInventory(id)}
              title={'Eliminar inventario'}
              text="Eliminar inventario de forma permanente"
            />
          </div>
        </div>
      </Modal>
      <div className="w-full relative">
        <div className="flex justify-between w-full">
          <div className="text-sm">
            Creado: {fromNow(date, { addSuffix: true })}
          </div>
          <span className=" ">
            <button
              className="underline"
              onClick={(e) => {
                e.preventDefault()
                handleOpenDetails()
              }}
            >
              ver
            </button>
          </span>
        </div>
        <div className="grid grid-cols-2 ">
          <div>Tipo: {type}</div>

          <div>Comentarios: {description}</div>
          <div>Creado por: {createdBy.name || ''}</div>
        </div>
        <div className="grid grid-cols-2 text-center">
          <div>Fisicas: {physicalStock?.length || 0}</div>
          <div>Perdidas: {stockMissed?.length || 0}</div>
          <div>Coinciencias: {stockCoincidences?.length || 0}</div>
          <div>Diferencias: {stockDifferences?.length || 0}</div>
        </div>
      </div>
    </Box>
  )
}

export default InventoryHistory
