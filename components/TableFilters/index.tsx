import useFilterByField from '@comps/hooks/useFilterByField'
import { subMonths } from 'date-fns'

const TableFilters = ({
  array,
  setArray
}: {
  array: unknown[]
  setArray: (array: any) => any
}) => {
  const { handleFilterBy } = useFilterByField(array)
  const filters = {
    Activos: { field: 'currentStatus', symbol: '==', value: 'ACTIVE' },
    Machos: { field: 'gender', symbol: '==', value: 'male' },
    Hembras: { field: 'gender', symbol: '==', value: 'female' },
    Muertos: {
      field: 'currentStatus',
      symbol: '==',
      value: 'DEAD'
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
  return (
    <div>
      <span className="text-sm">Filtrar por :</span>
      <div>
        {Object.entries(filters).map(([label, { field, symbol, value }]) => (
          <button
            key={label}
            className="btn rounded-full btn-xs m-1 btn-outline"
            onClick={() => {
              // @ts-ignore
              const res = handleFilterBy(field, symbol, value)
              setArray(res)
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TableFilters
