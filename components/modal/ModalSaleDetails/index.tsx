import PrintableSellForm from '@comps/forms/SellForm/PrintableSellForm'
import { deleteEvent } from '@firebase/Events/main'
import { useState } from 'react'
import Modal from '..'
import ModalDelete from '../ModalDelete'

const ModalSaleDetails = ({
  sale,
  label = 'ver'
}: {
  sale: any
  label: string
}) => {
  const [open, setOpen] = useState(false)
  const handleOpenBreeding = () => {
    setOpen(!open)
  }
  const handleDeleteSale = async (id) => {
    try {
      const res = await deleteEvent(id)
      console.log({ res })
    } catch (err) {
      console.log({ err })
    }
  }

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault()
          handleOpenBreeding()
        }}
        className="link"
      >
        {label}
      </button>
      {open && (
        <Modal
          open={open}
          handleOpen={handleOpenBreeding}
          title="Detalle de venta"
        >
          <PrintableSellForm sale={sale} />
          <div className="flex w-full justify-center">
            <ModalDelete
              handleDelete={() => {
                handleDeleteSale(sale.id)
              }}
              title={'Eliminar venta'}
              text='Se eliminara esta venta pero no se acutalizara el estado de los animales y quedará como "Vendido"'
            />
          </div>
        </Modal>
      )}
    </>
  )
}

export default ModalSaleDetails
