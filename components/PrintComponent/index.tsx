import SellForm from '@comps/forms/SellForm'
import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

const PrintComponent = () => {
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    // @ts-ignore
    content: () => componentRef.current
  })

  return (
    <div>
      <button onClick={handlePrint}>Print this out!</button>
      <SellForm ref={componentRef} />
    </div>
  )
}

export default PrintComponent
