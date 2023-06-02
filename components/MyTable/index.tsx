import * as React from 'react'

import {
  ColumnFiltersState,
  FilterFn,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import IndeterminateCheckbox from './IndeterminableCheckbox'
import DebouncedInput from '@comps/inputs/DebouncedInput'
import { rankItem } from '@tanstack/match-sorter-utils'
import Filters from '@comps/Filters'
import { FilterType } from '@comps/hooks/useFilterByField'

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
  weight?: {
    atBirth?: number
    atWeaning?: number
    at6Months?: number
  }
  images?: Image[]
}
interface Image {
  url: string
  description: string
}

const columnHelper = createColumnHelper<Person>()

interface HeaderType {
  label: string
  format?: (props: any) => React.ReactNode
}
function MyTable<T>({
  data = [],
  headers = {},
  showGlobalFilter,
  showSelectRow,
  onRowClick,
  hiddenCols,
  filters,
  onFilter,
  title = 'Titulo de tabla',
  defaultSort = []
}: {
  data: T[]
  headers?: Record<string, HeaderType>
  showGlobalFilter?: boolean | string[]
  showSelectRow?: boolean
  onRowClick?: (row: string | number) => void
  hiddenCols?: string[]
  filters?: Record<string, FilterType | FilterType[]>
  onFilter?: (filter: FilterType) => void
  title: string
  defaultSort?: SortingState
}) {
  // useDebugInformation('MyTable', {})
  // const [array, setArray] = React.useState([...data])

  const { columns } = getColumnsFromData(data, {
    includeAction: showSelectRow,
    headers,
    hiddenCols
  })

  const [sorting, setSorting] = React.useState<SortingState>([...defaultSort])
  const [globalFilter, setGlobalFilter] = React.useState('')
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
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  //**************************************************** Table configurations
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    //* Global filters configurations
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: fuzzyFilter,

    //* Columns filters
    onColumnFiltersChange: setColumnFilters,
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  // React.useEffect(() => {
  //   if (table.getState().columnFilters[0]?.id === 'fullName') {
  //     if (table.getState().sorting[0]?.id !== 'fullName') {
  //       table.setSorting([{ id: 'fullName', desc: false }])
  //     }
  //   }
  // }, [table.getState().columnFilters[0]?.id])

  return (
    <div className=" ">
      <h2 className="text-center font-bold">{title}</h2>

      <div>
        {filters && Object.keys(filters).length && (
          <Filters
            filters={filters}
            array={data}
            setArray={(e) => {
              // console.log({ e })
            }}
            onFilter={(e) => {
              console.log({ e })
              if (typeof e.value === 'string' || typeof e.value === 'number') {
                setColumnFilters([
                  ...columnFilters,
                  { id: e.field, value: `${e.value}` }
                ])
              }
            }}
            onClearFilter={() => {
              setColumnFilters?.([])
            }}
          />
        )}
      </div>
      {showGlobalFilter && (
        <div className="mb-2">
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
            className="input input-sm w-full "
            placeholder="Buscar ..."
          />
        </div>
      )}
      <div className="overflow-auto">
        <table className="table table-compact w-full ">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
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
                          header.column.columnDef?.header || [],
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
            {table.getRowModel().rows.map((row) => (
              <tr
                className="hover"
                key={row.id}
                onClick={() => {
                  onRowClick?.(row.id)
                }}
              >
                {row.getVisibleCells().map((cell, i) => {
                  //* Should sticky at the first of the row but have problems with z-index
                  if (i === 0)
                    return (
                      <th className="  !static" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell || [],
                          cell.getContext()
                        )}
                      </th>
                    )
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell || [],
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyTable

interface TableOptions {
  includeAction?: boolean
  headers?: Record<string, HeaderType>
  hiddenCols?: string[]
}

function getColumnsFromData(data: any[], options?: TableOptions) {
  const columns: any[] = []
  const columnHelper = createColumnHelper()
  const obj = data?.[0] || {}
  const keys = Object.keys(obj)
  // Display Column
  if (options?.includeAction) {
    columns.push({
      id: 'select',
      header: ({ table }: any) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler()
          }}
        />
      ),
      cell: ({ row }: any) => (
        <div className="px-1">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        </div>
      )
    })
  }

  keys.forEach((key) => {
    if (options?.hiddenCols?.includes(key)) return
    //@ts-ignore
    const col = columnHelper.accessor(key, {
      header: options?.headers?.[key]?.label || key,
      footer: (props) => props.column.id,
      cell(props) {
        return (
          options?.headers?.[key]?.format?.(props.getValue()) ||
          props.getValue()
        )
      }
    })
    columns.push(col)
  })
  return { columns }
}
