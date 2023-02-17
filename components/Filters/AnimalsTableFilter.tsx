import { FilterType } from '@comps/hooks/useFilterByField'
import { addMonths, subMonths } from 'date-fns'
import Filters from '.'
const animalsFilters: Record<string, FilterType | FilterType[]> = {
  // Activos: { field: 'state', symbol: '!=', value: 'ACTIVE' },
  Machos: { field: 'gender', symbol: '==', value: 'male' },
  Hembras: { field: 'gender', symbol: '==', value: 'female' },
  Muertos: {
    field: 'state',
    symbol: '==',
    value: 'DEAD'
  },
  Vendidos: {
    field: 'state',
    symbol: '==',
    value: 'SOLD'
  },
  Sementales: {
    field: 'isStallion',
    symbol: '==',
    value: true
  },
  '-5meses': {
    field: 'birthday',
    symbol: '>=',
    value: subMonths(new Date(), 5).getTime()
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
  },

  '3-7 meses': [
    {
      field: 'birthday',
      symbol: '<=',
      value: subMonths(new Date(), 3).getTime()
    },
    {
      field: 'birthday',
      symbol: '>=',
      value: subMonths(new Date(), 7).getTime()
    }
  ]
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
        filters={animalsFilters}
        array={array}
        setArray={setArray}
        defaultFilter={'Activos'}
      />
    </div>
  )
}

export default AnimalsTableFilter
