import IconStatus from '@comps/IconStatus'

const IconBreedingStatus = ({
  startInDays,
  finishInDays
}: {
  startInDays?: number
  finishInDays?: number
}) => {
  if (!startInDays || !finishInDays) {
    console.log('incorrect dates')
    return <></>
  }
  let status: IconStatus = 'info'
  if (startInDays > 1) status = 'waiting'
  if (startInDays <= 0) status = 'warning'
  if (finishInDays < 0) status = 'error'
  return (
    <span className="">
      <IconStatus status={status} />
    </span>
  )
}

export default IconBreedingStatus
