import useFilterByField, { FilterType } from '@comps/hooks/useFilterByField'
import Icon from '@comps/Icon'
import { useEffect } from 'react'

const Filters = ({
  array,
  setArray,
  filters,
  defaultFilter = ''
}: {
  array: unknown[]
  setArray: (array: any) => void
  filters: Record<string, FilterType | FilterType[]>
  defaultFilter?: string
}) => {
  const {
    handleFilterBy,
    filtersSelected,
    reset,
    arrayFiltered,
    handleFilterByArray
  } = useFilterByField(array, {
    labelDefaultFilter: defaultFilter,
    defaultFilter: Array.isArray(filters?.[defaultFilter])
      ? (filters?.[defaultFilter] as any[])
      : [filters?.[defaultFilter]]
  })
  console.log({ arrayFiltered })

  useEffect(() => {
    setArray(arrayFiltered)
  }, [arrayFiltered, setArray])

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
      <div className="text-center">
        <span>Coincidencias {arrayFiltered.length}</span>
      </div>
    </div>
  )
}

export default Filters
