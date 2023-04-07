import Icon from '@comps/Icon'
import { useState } from 'react'

export interface InfoBadgeType {
  title: string
  text: string
}
const InfoBadge = ({ title, text }: InfoBadgeType) => {
  const [show, setShow] = useState(false)
  return (
    <span className="relative bg-transparent">
      <button
        className="btn  btn-xs btn-ghost btn-circle text-info"
        onClick={(e) => {
          e.preventDefault()
          setShow(!show)
        }}
      >
        <Icon name="info" size="xs" />
      </button>
      {show && (
        <div className="absolute top-0 right-0 z-10 ">
          <div className=" bg-base-200 p-2 text-xs shadow-md rounded-md  max-sm-2xl">
            <div className="flex w-full justify-end">
              <Icon name="close" size="xs" />
            </div>
            <h6 className="font-bold">{title}</h6>
            <p className="break-words overflow-auto ">{text}</p>
          </div>
        </div>
      )}
    </span>
  )
}

export default InfoBadge
