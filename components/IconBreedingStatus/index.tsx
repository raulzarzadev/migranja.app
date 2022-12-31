import Icon from 'components/Icon'

const IconBreedingStatus = ({
  startInDays,
  finishInDays
}: {
  startInDays: number
  finishInDays: number
}) => {
  let status: IconStatus = 'info'
  if (startInDays > 1) status = 'success'
  if (startInDays <= 0) status = 'warning'
  if (finishInDays < 0) status = 'error'
  return (
    <span className="">
      <IconStatus status={status} />
    </span>
  )
}
type IconStatus = 'error' | 'success' | 'warning' | 'info'
export const IconStatus = ({ status }: { status: IconStatus }) => (
  <span className="">
    {status === 'error' && (
      <span className="btn btn-xs btn-circle btn-error">
        <Icon name="baned" size="xs" />
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

export default IconBreedingStatus
