import Icon from '@comps/Icon'
import React, { useRef } from 'react'
import ReactToPrint from 'react-to-print'
import SellForm from '.'

const PrintableSellForm = ({ sale }: { sale?: any }) => {
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
      <ForwardRefSellForm ref={componentRef} sale={sale} />
    </div>
  )
}

const ForwardRefSellForm = React.forwardRef(
  ({ sale }: { sale: any }, ref: any) => {
    return (
      <div ref={ref} className="max-w-lg mx-auto ">
        <SellForm sale={sale} />
      </div>
    )
  }
)
ForwardRefSellForm.displayName = 'ForwardRefSellForm'

export default PrintableSellForm
