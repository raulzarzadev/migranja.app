import Icon from '@comps/Icon'
import React, { useRef } from 'react'
import ReactToPrint from 'react-to-print'
import SellForm from '.'

const PrintableSellForm = () => {
  const componentRef = useRef()

  return (
    <div className="">
      <ReactToPrint
        documentTitle="Nueva venta"
        trigger={() => (
          <div className="flex w-full justify-end">
            <button className="btn btn-outline btn-sm">
              <span className="">
                <Icon name="print" />
              </span>
            </button>
          </div>
        )}
        content={() => componentRef.current || null}
        bodyClass="pt-10"
      />
      <ForwardRefSellForm ref={componentRef} />
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
