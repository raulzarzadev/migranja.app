import useSortByField from '@comps/hooks/useSortByField'
import HeaderTable from '@comps/MyTables/HeaderTable'
import { useEffect, useState } from 'react'

export interface Column<T> {
  id: string
  label: string
}
export interface MyTableType<TData> {
  columns: Column<TData>[]
  rows: {
    data: TData[]
  }
  rowsSelected?: string[]
  setRowsSelected?: (rows: string[]) => void
  selectByField: 'index' | string // of field
}

const MyTable = <T,>({
  columns,
  rows,
  rowsSelected,
  selectByField = 'index',
  setRowsSelected
}: MyTableType<T>) => {
  const { arraySorted, ...sortMethods } = useSortByField(rows.data)
  const [_rowsSelected, _setRowsSelected] = useState<string[]>([])
  const handleSelectRow = ({
    checked,
    index
  }: {
    checked: boolean
    index: number
  }) => {
    console.log({ checked })
    const _field = selectByField === 'index' ? index : selectByField

    if (checked) {
      _setRowsSelected([..._rowsSelected, `${_field}`])
      setRowsSelected?.([..._rowsSelected, `${_field}`])
    } else {
      _rowsSelected.splice(_rowsSelected.indexOf(`${_field}`), 1)
      console.log(_rowsSelected)
      _setRowsSelected(_rowsSelected)
      setRowsSelected?.(_rowsSelected)
    }
  }
  // useEffect(() => {
  //   if (rowsSelected?.length) {
  //     _setRowsSelected(rowsSelected)
  //   }
  // }, [rowsSelected])
  console.log({ _rowsSelected })

  return (
    <div>
      <table className="table table-compact">
        <thead>
          <tr>
            {setRowsSelected && (
              <th>
                <span>
                  <input type={'checkbox'} />
                </span>
              </th>
            )}
            {columns.map((column, i) => (
              <th key={i}>
                <HeaderTable
                  label={column?.label || column?.id}
                  fieldName={column?.id}
                  {...sortMethods}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {arraySorted.map((row, i) => {
            console.log(
              _rowsSelected?.includes(
                selectByField === 'index' ? `${i}` : row[selectByField]
              )
            )
            return (
              <tr key={i}>
                {setRowsSelected && (
                  <th>
                    <span>
                      <input
                        checked={_rowsSelected?.includes(
                          selectByField === 'index'
                            ? `${i}`
                            : row[selectByField]
                        )}
                        type={'checkbox'}
                        onChange={({ target: { checked } }) =>
                          handleSelectRow({
                            checked,
                            index: i
                          })
                        }
                      />
                    </span>
                  </th>
                )}
                {columns.map((column, i) => (
                  <td key={i}>{row[column.id]}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default MyTable
