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
const SquareOption2 = ({
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
        border-4  hover:border-gray-500 rounded-xl flex h-min btn  bg-base-300  text-base-content  flex-nowrap justify-between w-full
        ${selected ? ' border-base-content ' : 'border-transparent'} 
        `}
      onClick={onClick}
      {...props}
    >
      {iconName && (
        <span className="mr-2">
          <Icon name={iconName} />
        </span>
      )}
      <span>{title}</span>
    </button>
  )
}

export default SquareOption2
