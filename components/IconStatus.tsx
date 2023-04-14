import Icon from './Icon'

export type IconStatus = 'error' | 'success' | 'warning' | 'info' | 'waiting'

export const IconStatus = ({ status }: { status: IconStatus }) => (
  <span className="">
    {status === 'error' && (
      <span className="btn btn-xs btn-circle btn-error">
        <Icon name="baned" size="xs" />
      </span>
    )}
    {status === 'waiting' && (
      <span className="btn btn-xs btn-circle btn-success ">
        <Icon name="clock" size="xs" />
      </span>
    )}
    {status === 'success' && (
      <span className="btn btn-xs btn-circle btn-success ">
        <Icon name="done" size="xs" />
      </span>
    )}
    {status === 'warning' && (
      <span className="btn btn-xs btn-circle btn-warning ">
        <Icon name="info" size="xs" />
      </span>
    )}
    {status === 'info' && (
      <span className="btn btn-xs btn-circle btn-info ">
        <Icon name="info" size="xs" />
      </span>
    )}
  </span>
)
export default IconStatus
