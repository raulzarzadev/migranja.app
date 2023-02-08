import { FilterType } from '@comps/hooks/useFilterByField'
import { addDays, subDays } from 'date-fns'
import Filters from '.'

const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth() + 1
const thisMonthStartAt = new Date(currentYear, currentMonth - 1, 1).getTime()
const thisMonthFinishAt = new Date(currentYear, currentMonth, 0).getTime()
const lastMonthStartAt = new Date(currentYear, currentMonth - 2, 1).getTime()
const filters: Record<string, FilterType | FilterType[]> = {
  '+- 7 dias': [
    {
      field: 'eventData.date',
      symbol: '<=',
      value: addDays(new Date(), 7)
    },
    {
      field: 'eventData.date',
      symbol: '>=',
      value: subDays(new Date(), 7)
    }
  ],
  'Este mes': [
    {
      field: 'eventData.date',
      symbol: '<=',
      value: thisMonthFinishAt
    },
    {
      field: 'eventData.date',
      symbol: '>=',
      value: thisMonthStartAt
    }
  ],
  'Mes anterior': [
    {
      field: 'eventData.date',
      symbol: '>=',
      value: lastMonthStartAt
    },
    {
      field: 'eventData.date',
      symbol: '<',
      value: thisMonthStartAt
    }
  ],
  Montas: { field: 'type', symbol: '==', value: 'BREEDING' },
  Partos: { field: 'type', symbol: '==', value: 'BIRTH' },
  Destetes: { field: 'type', symbol: '==', value: 'WEANING' },
  Vacios: { field: 'type', symbol: '==', value: 'EMPTY' },
  Bajas: { field: 'type', symbol: '==', value: 'DROP_OUT' },
  Altas: { field: 'type', symbol: '==', value: 'DROP_IN' }
}
const EventFilters = ({
  array,
  setArray
}: {
  array: unknown[]
  setArray: (array: any) => void
}) => {
  return (
    <div>
      <Filters
        filters={filters}
        array={array}
        setArray={setArray}
        // defaultFilter={'+- 7 dias'}
      />
    </div>
  )
}

export default EventFilters
