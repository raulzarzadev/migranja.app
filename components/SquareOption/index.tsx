import { useOutsideClick } from 'components/hooks/useOutsideClick'
import Icon from 'components/Icon'
import { IconName } from 'components/Icon/icons-list'
import { ReactNode, useRef, useState } from 'react'

interface SquareOptionType {
  title: string
  iconName: IconName
  selected?: boolean
  children?: ReactNode
  onClick?: () => void
}
const SquareOption = ({
  title,
  iconName,
  children,
  onClick,
  selected,
  ...props
}: SquareOptionType) => {
  return (
    <button
      className={`
        border-4  hover:border-base-content rounded-xl
        ${selected ? ' border-base-content ' : 'border-transparent'} 
        `}
      onClick={onClick}
      {...props}
    >
      <div className=" flex w-16 flex-col aspect-square rounded-lg bg-base-300 justify-center items-center shadow-md cursor-pointer">
        <span>{title}</span>
        {iconName && (
          <span>
            <Icon name={iconName} />
          </span>
        )}
      </div>
    </button>
  )
}

export default SquareOption
