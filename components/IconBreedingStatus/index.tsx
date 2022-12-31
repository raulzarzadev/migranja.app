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
    <div>
      <span className="pr-1">
        <IconStatus status={status} />
      </span>
    </div>
  )
}
type IconStatus = 'error' | 'success' | 'warning' | 'info'
export const IconStatus = ({ status }: { status: IconStatus }) => (
  <span className="pr-1">
    {status === 'error' && (
      <span className="text-error ">
        <Icon name="baned" size="xs" />
      </span>
    )}
    {status === 'success' && (
      <span className="text-success ">
        <Icon name="done" size="xs" />
      </span>
    )}
    {status === 'warning' && (
      <span className="text-warning ">
        <Icon name="info" size="xs" />
      </span>
    )}
    {status === 'info' && (
      <span className="text-info ">
        <Icon name="info" size="xs" />
      </span>
    )}
  </span>
)

export default IconBreedingStatus
