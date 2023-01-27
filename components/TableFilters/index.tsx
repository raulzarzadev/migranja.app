import useFilterByField from '@comps/hooks/useFilterByField'
import Icon from '@comps/Icon'
import { subMonths } from 'date-fns'
import { useEffect, useState } from 'react'

const TableFilters = ({
  array,
  setArray
}: {
  array: unknown[]
  setArray: (array: any) => any
}) => {
  const { handleFilterBy, filtersSelected, reset, arrayFiltered } =
    useFilterByField(array)

  useEffect(() => {
    setArray(arrayFiltered)
  }, [arrayFiltered, setArray])

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
        {!!filtersSelected.length && (
          <button
            className={`btn btn-circle m-1 btn-xs btn-outline btn-error`}
            onClick={() => {
              reset()
            }}
          >
            <Icon name="close" size="xs" />
          </button>
        )}
        {Object.entries(filters).map(([label, { field, symbol, value }]) => (
          <button
            key={label}
            disabled={filtersSelected.includes(label)}
            className={`btn rounded-full btn-xs m-1 btn-outline ${
              filtersSelected.includes(label) && 'btn-active'
            }`}
            onClick={() => {
              // @ts-ignore
              handleFilterBy(field, symbol, value, { label })
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
