import CurrencySpan from '@comps/CurrencySpan'
import MyTable, { MyTableType, TableColumn } from '@comps/MyTable'
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

  const tableData: MyTableType<typeof sales[0]> = {
    columns: [
      {
        //@ts-ignore
        id: 'eventData.date',
        label: 'Fecha',
        format: (data) => fromNow(data, { addSuffix: true })
      },
      {
        //@ts-ignore

        id: 'eventData.price',
        label: 'Precio',
        format: (data) => <CurrencySpan quantity={parseFloat(data || '0')} />
      },
      {
        //@ts-ignore

        id: 'eventData.animalsQuantity',
        label: 'Cant'
      },
      {
        //@ts-ignore

        id: 'eventData.total',
        label: 'Total',
        format: (data) => <CurrencySpan quantity={parseFloat(data || '0')} />
      }
    ],
    rows: { data: sales }
  }

  const [openModal, setOpenModal] = useState(false)
  const [saleSelected, setSaleSelected] = useState(0)
  const handleOpenSaleModal = () => {
    setOpenModal(!openModal)
  }

  return (
    <div className="">
      <h2 className="text-center font-bold">Lista de ventas</h2>
      <MyTable
        setRowsSelected={(e) => {
          console.log({ e })
        }}
        onRowClick={(i) => {
          setSaleSelected(i)
          handleOpenSaleModal()
        }}
        {...tableData}
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
