import React, { ForwardedRef, Ref, useRef } from 'react'
import ReactToPrint from 'react-to-print'
import SellForm from '.'

const PrintableSellForm = () => {
  const componentRef = useRef()

  return (
    <div>
      <ReactToPrint
        trigger={() => <button>Imprimir!</button>}
        content={() => componentRef.current || null}
      />
      <div>
        <ForwardRefSellForm ref={componentRef} />
      </div>
    </div>
  )
}

const ForwardRefSellForm = React.forwardRef((props, ref: any) => {
  return (
    <div ref={ref} className="bg-base-300 rounded-md p-2 max-w-md  mx-auto ">
      <SellForm />
    </div>
  )
})
ForwardRefSellForm.displayName = 'ForwardRefSellForm'

export default PrintableSellForm
