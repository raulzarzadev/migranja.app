import useFilterByField from '@comps/hooks/useFilterByField'
import Icon from '@comps/Icon'
import { addDays, subDays } from 'date-fns'
import { useEffect } from 'react'

const EventsFilters = ({
  array,
  setArray
}: {
  array: unknown[]
  setArray: (array: any) => any
}) => {
  const {
    handleFilterBy,
    filtersSelected,
    reset,
    arrayFiltered,
    handleFilterByArray
  } = useFilterByField(array)

  useEffect(() => {
    setArray(arrayFiltered)
  }, [arrayFiltered, setArray])

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  const thisMonthStartAt = new Date(currentYear, currentMonth - 1, 1).getTime()
  const thisMonthFinishAt = new Date(currentYear, currentMonth, 0).getTime()
  const lastMonthStartAt = new Date(currentYear, currentMonth - 2, 1).getTime()
  const filters = {
    Destetes: { field: 'type', symbol: '==', value: 'WEANING' },
    Vacios: { field: 'type', symbol: '==', value: 'EMPTY' },
    Partos: { field: 'type', symbol: '==', value: 'BIRTH' },
    Bajas: { field: 'type', symbol: '==', value: 'DROP_OUT' },
    Altas: { field: 'type', symbol: '==', value: 'DROP_IN' },
    Montas: { field: 'type', symbol: '==', value: 'BREEDING' },
    // 'Creado este mes': {
    //   field: 'createdAt',
    //   symbol: '>=',
    //   value: thisMonthStartAt
    // },
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
    ]
  }
  return (
    <div>
      <span className="text-sm">Filtrar por :</span>
      <div className="flex flex-wrap">
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
        {Object.entries(filters).map(([label, filter]) => {
          if (Array.isArray(filter)) {
            return (
              <button
                key={label}
                disabled={filtersSelected.includes(label)}
                className={`btn rounded-full btn-xs m-1 btn-outline ${
                  filtersSelected.includes(label) && 'btn-active'
                }`}
                onClick={() => {
                  // @ts-ignore
                  handleFilterByArray(filter, { label })
                }}
              >
                {label}
              </button>
            )
          }
          return (
            <button
              key={label}
              disabled={filtersSelected.includes(label)}
              className={`btn rounded-full btn-xs m-1 btn-outline ${
                filtersSelected.includes(label) && 'btn-active'
              }`}
              onClick={() => {
                // @ts-ignore
                handleFilterBy(filter.field, filter.symbol, filter.value, {
                  label
                })
              }}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default EventsFilters
