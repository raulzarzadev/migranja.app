import { ReactNode } from 'react'
import { AnimalWeaning } from 'types/base/AnimalWeaning.model'
import IconStatus from './IconStatus'

const WeaningIconStatus = ({
  status
}: {
  status: AnimalWeaning['eventData']['status']
}) => {
  const iconStatus: Record<AnimalWeaning['eventData']['status'], IconStatus> = {
    PENDING: 'waiting',
    DONE: 'success',
    CANCELLED: 'warning'
  }
  return <IconStatus status={iconStatus[status]} />
}

export default WeaningIconStatus
