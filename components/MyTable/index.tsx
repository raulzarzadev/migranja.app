import useSortByField from '@comps/hooks/useSortByField'
import HeaderTable from '@comps/MyTables/HeaderTable'
import { FC, ReactNode, useEffect, useState } from 'react'
import { getProperty } from 'dot-prop'

// Define la interfaz para los datos de las filas
interface TableRowData {
  [key: string]: any // Puedes utilizar cualquier tipo para los valores, según tus necesidades
}

// Define la interfaz para las columnas de la tabla
export interface TableColumn<TData extends TableRowData> {
  id: keyof TData // Tipamos el id con las claves del objeto que se pasará como datos
  label: string
  format?: (data?: string) => React.ReactNode
  subColumns?: Array<TableColumn<TData[keyof TData]>> // Tipamos las subcolumnas
}

// Define la interfaz de la tabla con los tipos que necesitas

// Define la interfaz de la tabla con los tipos que necesitas
export interface MyTableType<TData extends TableRowData> {
  columns: Array<{
    id: keyof TData
    label: string
    format?: (data?: string) => React.ReactNode
  }>
  rows: {
    data: TData[]
  }
  rowsSelected?: string[]
  setRowsSelected?: (rows: string[]) => void
}

export interface MyTableProps<TData extends TableRowData> {
  columns: Array<{
    id: keyof TData
    label: string
    format?: (data?: string) => React.ReactNode
  }>
  rows: {
    data: TData[]
  }
  rowsSelected?: string[]
  setRowsSelected?: (rows: string[]) => void
  onRowClick?: (index: number) => void
}

const MyTable: FC<MyTableProps<any>> = ({
  columns,
  rows,
  setRowsSelected,
  onRowClick
}) => {
  const { arraySorted, ...sortMethods } = useSortByField(rows.data)
  const [_rowsSelected, _setRowsSelected] = useState<number[]>([])
  const [halfChecked, setHalfChecked] = useState(false)
  const onSelectRow = (index: number) => {
    const auxArr = [..._rowsSelected]
    if (auxArr.includes(index)) {
      const newArr = auxArr.filter((item) => item != index)
      _setRowsSelected([...newArr])
    } else {
      _setRowsSelected([...auxArr, index])
    }
  }
  const onSelectAllTable = (checked: boolean) => {
    if (!checked) {
      _setRowsSelected([])
    } else {
      const rowsIndex = rows.data.map((_, i) => i)
      _setRowsSelected(rowsIndex)
    }
  }

  useEffect(() => {
    if (_rowsSelected.length > 0 && _rowsSelected.length != rows.data.length) {
      setHalfChecked(true)
    } else {
      setHalfChecked(false)
    }
  }, [_rowsSelected, rows.data.length])

  return (
    <div>
      <table className="table table-compact text-center  ">
        <thead>
          <tr>
            {setRowsSelected && (
              <th>
                <span>
                  <input
                    className={`checkbox checkbox-xs ${
                      halfChecked && 'bg-slate-600'
                    } `}
                    onChange={({ target: { checked } }) =>
                      onSelectAllTable(checked)
                    }
                    type={'checkbox'}
                  />
                </span>
              </th>
            )}
            {columns.map((column, i) => (
              <th key={i}>
                <HeaderTable
                  label={column?.label || (column?.id as string)}
                  fieldName={column?.id as string}
                  {...sortMethods}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {arraySorted.map((row, i) => {
            return (
              <tr key={i} className="hover" onClick={() => onRowClick?.(i)}>
                {setRowsSelected && (
                  <th>
                    <span>
                      <input
                        className=" checkbox checkbox-xs"
                        checked={_rowsSelected?.includes(i)}
                        type={'checkbox'}
                        onChange={() => onSelectRow(i)}
                      />
                    </span>
                  </th>
                )}
                {columns.map((column, i) => (
                  <td key={i}>
                    {column?.format?.(getProperty(row, column?.id as string)) ??
                      getProperty(row, column.id as string)}
                  </td>
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
