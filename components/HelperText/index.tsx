import Icon from 'components/Icon'
import { IconName } from 'components/Icon/icons-list'

const HelperText = ({
  type,
  text,
  show = false
}: {
  type: 'info' | 'error'
  text: string
  show?: boolean
}) => {
  interface Style {
    icon: IconName
    classes: string
  }
  const style: Record<string, Style> = {
    info: {
      icon: 'info',
      classes: 'bg-info text-info-content'
    },
    error: {
      icon: 'baned',
      classes: 'bg-error text-error-content'
    },
    warning: {
      icon: 'bell',
      classes: 'bg-warning text-warning-content'
    }
  }
  return (
    <>
      <div
        tabIndex={0}
        className={`collapse  items-center px-2  rounded-md p-1 group ${
          show ? 'flex' : 'hidden'
        }`}
      >
        <div className={`  ${style[type].classes} rounded-full p-0.5`}>
          <Icon name={style[type].icon} size="sm" />
        </div>
        <div className={`collapse-content ${style[type].classes} rounded-xl`}>
          <p className="p-1 text-sm">{text}</p>
        </div>
      </div>
    </>
  )
}

export default HelperText
