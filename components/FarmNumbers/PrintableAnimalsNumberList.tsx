import Icon from '@comps/Icon'
import React, { useRef } from 'react'
import ReactToPrint from 'react-to-print'
import { NumbersAnimalListType } from './StatCardWithModalAnimalsList'
import AnimalsListNumbers from './AnimalsListNumbers'

const PrintableAnimalsNumberList = ({
  animals,
  title,
  earringsSelected,
  setEarringsSelected
}: NumbersAnimalListType) => {
  const componentRef = useRef()

  return (
    <div className="">
      <ReactToPrint
        documentTitle="Lista de animales"
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
        bodyClass="pt-10 px-10"
      />
      <ForwardPrintArea
        ref={componentRef}
        animals={animals}
        title={title}
        earringsSelected={earringsSelected}
        setEarringsSelected={setEarringsSelected}
      />
    </div>
  )
}

const ForwardPrintArea = React.forwardRef(
  (
    {
      animals,
      title,
      earringsSelected,
      setEarringsSelected
    }: NumbersAnimalListType,
    ref: any
  ) => {
    return (
      <div ref={ref} className=" p-4">
        <h3 className="text-lg mb-10">
          <span>Lista de: </span>
          <strong className="font-bold">{title}</strong>
        </h3>
        <AnimalsListNumbers
          animals={animals}
          title={title}
          earringsSelected={earringsSelected}
          setEarringsSelected={setEarringsSelected}
        />
      </div>
    )
  }
)
ForwardPrintArea.displayName = 'ForwardPrintArea'

export default PrintableAnimalsNumberList
