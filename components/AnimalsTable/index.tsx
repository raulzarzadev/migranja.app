import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  getPaginationRowModel,
  FilterFn,
  getFilteredRowModel
} from '@tanstack/react-table'
import GENDER_OPTIONS from 'components/CONSTANTS/GENDER_OPTIONS'
import Icon from 'components/Icon'
import { useEffect, useState } from 'react'
import { myFormatDate } from 'utils/dates/myDateUtils'
import { AnimalType } from '../../firebase/types.model.ts/AnimalType.model'
import { rankItem } from '@tanstack/match-sorter-utils'
import ParentModal from 'components/ParentModal/indext'
export interface RowSelectedType {
  id?: string
  earring?: string
}
export interface AnimalTableType {
  animalsData: Partial<AnimalType>[]
  setSelectedRows?: (rows: string[] | null) => void
  setSelectedRow?: (row: RowSelectedType | null) => void
  settings?: {
    selectMany?: boolean
  }
}
const AnimalsTable = ({
  animalsData,
  settings,
  setSelectedRow,
  setSelectedRows
}: AnimalTableType) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const columnHelper = createColumnHelper<AnimalType>()
  const columns = [
    columnHelper.accessor('earring', {
      header: 'Arete'
    }),
    columnHelper.accessor('batch', {
      header: 'Lote'
    }),
    columnHelper.accessor('gender', {
      header: 'Sexo',
      cell: (props) => <span>{GENDER_OPTIONS[props.getValue()]?.label}</span>
    }),
    columnHelper.accessor('birthday', {
      header: 'Nac',
      cell: (props) => (
        <span>
          {props.getValue()
            ? props.getValue() && myFormatDate(props.getValue(), 'dd-MMM-yy')
            : '-'}
        </span>
      )
    }),
    // columnHelper.accessor('status', {
    //   header: 'Status'
    // }),

    columnHelper.accessor('parents', {
      header: 'Padres',
      cell: (props) => (
        <span className="flex w-full justify-between">
          {
            <ParentModal
              parentReference={props.getValue()?.father?.earring}
              type="father"
            />
          }
          {
            <ParentModal
              parentReference={props.getValue()?.mother?.earring}
              type="mother"
            />
          }
        </span>
      )
    })
  ]
  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({
      itemRank
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
  }
  const [globalFilter, setGlobalFilter] = useState('')
  const table = useReactTable({
    data: animalsData as any,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      sorting,
      globalFilter
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel()
  })

  const [_selectMany, _setSelectMany] = useState(false)
  const [_selectedRows, _setSelectedRows] = useState<string[]>([])
  const [_selectedRow, _setSelectedRow] = useState<RowSelectedType | null>(null)

  const _onSelectNewRow = (id?: string) => {
    if (!id) return console.log('no row selected')
    if (_selectedRows.includes(id)) {
      const cleanRows = [..._selectedRows.filter((row) => row !== id)]
      _setSelectedRows(cleanRows)
      setSelectedRows?.(cleanRows)
    } else {
      const addRow = [..._selectedRows, id]
      _setSelectedRows(addRow)
      setSelectedRows?.(addRow)
    }
  }

  const _onSelectRow = (row: RowSelectedType) => {
    const { id, earring } = row
    if (
      (id ?? '') === _selectedRow?.id || // que no sea nullish e igual a selected id
      (earring ?? '') === _selectedRow?.earring
    ) {
      _setSelectedRow(null)
      setSelectedRow?.(null)
    } else {
      _setSelectedRow({ earring, id })
      setSelectedRow?.({ earring, id })
    }
  }
  const _onRowClick = (row: RowSelectedType | null) => {
    if (!row) return 'no row selected'
    if (_selectMany) {
      _onSelectNewRow(row?.id)
    } else {
      _onSelectRow(row)
    }
  }

  const handleSelectMany = (checked: boolean) => {
    _setSelectMany(checked)
    _setSelectedRows([])
    _setSelectedRow(null)
    setSelectedRow?.(null)
    setSelectedRows?.(null)
  }

  return (
    <div className="p-2">
      <div className=" justify-center flex my-2 items-center w-full">
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(String(value))}
          className=" input input-sm w-full"
          placeholder="Buscar..."
        />
        <div className="whitespace-nowrap ml-1">
          {table.getFilteredRowModel().rows.length} de {animalsData.length || 0}
        </div>
      </div>
      <div
        className="flex from-control
      "
      >
        {settings?.selectMany && (
          <label className="label ">
            <input
              type={'checkbox'}
              className="checkbox checkbox-sm"
              onChange={({ target: { checked } }) => handleSelectMany(checked)}
            />
            <span className="label-text ml-1">Seleccionar varios</span>
          </label>
        )}
      </div>
      <div className={`overflow-x-auto  mx-auto`}>
        <table className="mx-aut table table-compact mx-auto  ">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    {...{
                      className: header.column.getCanSort()
                        ? 'cursor-pointer select-none'
                        : '',
                      onClick: header.column.getToggleSortingHandler()
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽'
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const itemId = row.original.id
              const itemEarring = row.original.earring
              return (
                <tr
                  key={row.id}
                  className={`hover cursor-pointer ${
                    (itemEarring ?? '') === _selectedRow?.earring &&
                    ' border-4 border-base-content'
                  } 

              ${
                _selectedRows.includes(itemId) && 'border-4 border-base-content'
              }
              `}
                  onClick={() => {
                    _onRowClick?.({
                      id: itemId,
                      earring: itemEarring
                    })
                    // _selectMany && handleSelectNewRow(row.original.id)
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <th
                      key={cell.id}
                      className={`font-normal ${
                        row.original?.isDuplicated && ' bg-error'
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="h-4" />
      <div className="flex flex-col items-center gap-2 mx-auto justify-center">
        <span className="flex items-center gap-1">
          <div>Página</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <div>
          {/* <button
            className="btn btn-outline btn-sm btn-square"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <Icon name="left" size="xs" />
          </button> */}
          <button
            className="btn btn-outline btn-sm btn-square mx-2"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <Icon name="left" size="xs" />
          </button>
          <button
            className="btn btn-outline btn-sm btn-square mx-2"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <Icon name="right" size="xs" />
          </button>
          {/* <button
            className="btn btn-outline btn-sm btn-square"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button> */}
        </div>
      </div>
    </div>
  )
}
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

export default AnimalsTable
