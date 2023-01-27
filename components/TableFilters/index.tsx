import useFilterByField from '@comps/hooks/useFilterByField'
import { formatDistance } from 'date-fns'
import { useState } from 'react'

const TableFilters = ({
  array,
  setArray
}: {
  array: unknown[]
  setArray: (array: unknown[]) => unknown[]
}) => {
  //const { arrayFiltered, handleFilterBy } = useFilterByField(array)
  const handleSortBy = (filterFn: Filters) => {
    console.log(fnsFilters[filterFn])
    //setArray(fnsFilters[filterFn])
  }
  const [showRange, setShowRange] = useState(false)

  const fnsFilters = {
    males: array.filter((a) => a?.gender === 'male'),
    female: array.filter((a) => a?.gender === 'female'),
    actives: array.filter((a) => a?.currentStatus === 'ACTIVE'),
    age: () => {
      setShowRange(true)
      return array.sort((a, b) => b?.birthday - a?.birthday)
    }
  } as const
  const handleSetAge = (e) => {
    const { value, name } = e.target
    const res = array.filter((a) => {
      const distance = formatDistance(a?.birthday, new Date())
      a?.birthday > desde && b < hasta
    })
  }
  type Filters = keyof typeof fnsFilters
  return (
    <div>
      <span>Filtrar por :</span>
      <div>
        <button onClick={() => handleSortBy('males')}>Machos</button>
        <button onClick={() => handleSortBy('female')}>Hembras</button>
        <button onClick={() => handleSortBy('actives')}>Activos</button>
        <button onClick={() => handleSortBy('age')}>Edad</button>
      </div>
      {showRange && (
        <div>
          <div className="form-control ">
            <label>
              Desde
              <input
                onChange={(e) => handleSetAge(e)}
                type={'number'}
                name="from"
              />
            </label>
          </div>
          <div className="form-control ">
            <label>
              Hasta
              <input
                onChange={(e) => handleSetAge(e)}
                type={'number'}
                name="to"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

export default TableFilters
