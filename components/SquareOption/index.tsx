import Icon from 'components/Icon'
import { IconName } from 'components/Icon/icons-list'
import { ReactNode } from 'react'

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
        border-4  hover:border-gray-500 rounded-xl flex h-min
        ${selected ? ' border-base-content ' : 'border-transparent'} 
        `}
      onClick={onClick}
      {...props}
    >
      <div className=" text-xs flex w-[4rem] flex-col aspect-square rounded-lg bg-base-300 justify-center items-center shadow-md cursor-pointer">
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
