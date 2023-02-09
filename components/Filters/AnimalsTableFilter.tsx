import { FilterType } from '@comps/hooks/useFilterByField'
import { subMonths } from 'date-fns'
import Filters from '.'
const filters: Record<string, FilterType> = {
  Activos: { field: 'currentStatus', symbol: '==', value: 'ACTIVE' },
  Machos: { field: 'gender', symbol: '==', value: 'male' },
  Hembras: { field: 'gender', symbol: '==', value: 'female' },
  Muertos: {
    field: 'currentStatus',
    symbol: '==',
    value: 'DEAD'
  },
  Vendidos: {
    field: 'currentStatus',
    symbol: '==',
    value: 'SOLD'
  },
  Sementales: {
    field: 'isStallion',
    symbol: '==',
    value: true
  },
  '-3meses': {
    field: 'birthday',
    symbol: '>=',
    value: subMonths(new Date(), 3).getTime()
  },
  '+3meses': {
    field: 'birthday',
    symbol: '<=',
    value: subMonths(new Date(), 3).getTime()
  },
  '+7meses': {
    field: 'birthday',
    symbol: '<=',
    value: subMonths(new Date(), 7).getTime()
  }
}
const AnimalsTableFilter = ({
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
        defaultFilter={'Activos'}
      />
    </div>
  )
}

export default AnimalsTableFilter
