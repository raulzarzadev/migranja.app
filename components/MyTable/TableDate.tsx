import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'

const TableDate = ({ date }: { date: number | Date }) => {
  return (
    <span className="grid">
      <span>{myFormatDate(date, 'dd/MM/yy')}</span>
      <span className="text-xs">{fromNow(date, { addSuffix: true })}</span>
    </span>
  )
}

export default TableDate
