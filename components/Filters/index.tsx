import useDebugInformation from '@comps/hooks/useDebugInformation'
import useFilterByField, { FilterType } from '@comps/hooks/useFilterByField'
import Icon from '@comps/Icon'
import { useEffect } from 'react'

const Filters = ({
  array,
  setArray,
  filters,
  onFilter,
  onClearFilter
}: {
  array: unknown[]
  setArray: (array: any) => void
  filters: Record<string, FilterType | FilterType[]>
  onFilter?: (filter: FilterType) => void
  onClearFilter?: () => void
  // defaultFilter?: string
}) => {
  // useDebugInformation('Filters', { array, filters })
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

  return (
    <div>
      <span className="text-sm">Filtrar por :</span>
      <div className="flex flex-wrap">
        {!!filtersSelected.length && (
          <button
            className={`btn btn-circle m-1 btn-xs btn-outline btn-error`}
            onClick={() => {
              reset()
              onClearFilter?.()
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
                  onFilter?.(filter)
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
                onFilter?.(filter)
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
