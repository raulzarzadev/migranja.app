import CurrencySpan from '@comps/CurrencySpan'
import MyTable from '@comps/MyTable_v2'
import PrintableSellForm from '@comps/forms/SellForm/PrintableSellForm'
import Modal from '@comps/modal'
import ModalDelete from '@comps/modal/ModalDelete'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FarmStateAnimalEvent, selectFarmEvents } from 'store/slices/farmSlice'
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'

const SalesList = () => {
  const [sales, setSales] = useState<FarmStateAnimalEvent[]>([])
  const farmEvents = useSelector(selectFarmEvents)

  useEffect(() => {
    setSales(farmEvents.filter((event) => event.type === 'SELL'))
  }, [farmEvents])

  const [openModal, setOpenModal] = useState(false)
  const [saleSelected, setSaleSelected] = useState(0)
  const handleOpenSaleModal = () => {
    setOpenModal(!openModal)
  }

  return (
    <div className="">
      <h2 className="text-center font-bold">Lista de ventas</h2>
      <MyTable
        data={[
          {
            firstName: 'tanner',
            lastName: 'linsley',
            age: 24,
            visits: 100,
            status: 'In Relationship',
            progress: 50,
            weight: {
              atBirth: 3,
              atWeaning: 12,
              at6Months: 24
            }
          },
          {
            firstName: 'tandy',
            lastName: 'miller',
            age: 40,
            visits: 40,
            status: 'Single',
            progress: 80,
            images: [
              { url: 'http://localhost/image', description: 'imagen de prueba' }
            ]
          }
        ]}
      />
      {openModal && (
        <Modal
          open={openModal}
          handleOpen={handleOpenSaleModal}
          title="Detalle de venta"
        >
          <PrintableSellForm sale={sales[saleSelected]} />
          <div className="flex w-full justify-center">
            {/* <ModalDelete
              handleDelete={() => {
                // handleDeleteSale(sale?.id || '')
              }}
              title={'Eliminar venta'}
              text='Se eliminara esta venta pero no se acutalizara el estado de los animales y quedará como "Vendido"'
            /> */}
          </div>
        </Modal>
      )}
    </div>
  )
}

export default SalesList
