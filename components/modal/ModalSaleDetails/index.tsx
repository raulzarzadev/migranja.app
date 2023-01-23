import PrintableSellForm from '@comps/forms/SellForm/PrintableSellForm'
import { useState } from 'react'
import Modal from '..'

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
          title="Breeding details"
        >
          <PrintableSellForm sale={sale} />
        </Modal>
      )}
    </>
  )
}

export default ModalSaleDetails
