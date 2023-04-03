import Icon from '@comps/Icon'
import { useState } from 'react'

const InfoBadge = ({ title, text }: { title: string; text: string }) => {
  const [show, setShow] = useState(false)
  return (
    <span className="relative">
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
          <div className="min-h-20 aspect-video bg-base-200 p-2 text-xs shadow-md rounded-md whitespace-pre-wrap ">
            <div className="flex w-full justify-end">
              <Icon name="close" size="xs" />
            </div>
            <h6 className="font-bold">{title}</h6>
            <p>{text}</p>
          </div>
        </div>
      )}
    </span>
  )
}

export default InfoBadge
