import CurrencySpan from '@comps/CurrencySpan'
import MyTable from '@comps/MyTable'
import TableDate from '@comps/MyTable/TableDate'
import PrintableSellForm from '@comps/forms/SellForm/PrintableSellForm'
import Modal from '@comps/modal'
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
  const [saleSelected, setSaleSelected] = useState<number | string>(0)
  const handleOpenSaleModal = () => {
    setOpenModal(!openModal)
  }

  return (
    <>
      <MyTable
        title="Lista de ventas"
        // showGlobalFilter
        // showSelectRow
        onRowClick={(e) => {
          setSaleSelected(e)
          handleOpenSaleModal()
        }}
        headers={{
          date: {
            label: 'Fecha',
            format: (props) => <TableDate date={props} />
          },
          price: {
            label: 'Precio',
            format: (props: any) => <CurrencySpan quantity={props} />
          },
          weightT: {
            label: 'PesoT'
          },
          total: {
            label: 'Total$',
            format: (props) => (
              <CurrencySpan
                quantity={parseFloat(props).toFixed(1) as unknown as number}
              />
            )
          }
        }}
        hiddenCols={['id']}
        data={sales.map((sale) => ({
          id: sale.id,
          date: sale.eventData.date,
          price: sale.eventData.price,
          weightT: sale.eventData.totalWeight,
          cantU: sale.eventData.animalsQuantity,
          total: sale.eventData.total
        }))}
      />
      {openModal && (
        <Modal
          open={openModal}
          handleOpen={handleOpenSaleModal}
          title="Detalle de venta"
        >
          <PrintableSellForm sale={sales[saleSelected as number]} />
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
    </>
  )
}

export default SalesList
