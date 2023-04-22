import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'

const TableDate = ({ date }: { date: number | Date }) => {
  return (
    <span className="grid">
      <span>{date ? myFormatDate(date, 'dd/MM/yy') : 'n/d'}</span>
      <span className="text-xs">
        {date ? fromNow(date, { addSuffix: true }) : 'n/d'}
      </span>
    </span>
  )
}

export default TableDate
