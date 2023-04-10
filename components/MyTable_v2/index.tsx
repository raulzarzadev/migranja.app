import * as React from 'react'

import {
  ColumnDef,
  FilterFn,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import IndeterminateCheckbox from './IndeterminableCheckbox'
import DebouncedInput from '@comps/inputs/DebouncedInput'
import { rankItem } from '@tanstack/match-sorter-utils'

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
  hiddenCols
}: {
  data: T[]
  headers?: Record<string, HeaderType>
  showGlobalFilter?: boolean
  showSelectRow?: boolean
  onRowClick?: (row: string | number) => void
  hiddenCols: string[]
}) {
  const { columns } = getColumnsFromData(data, {
    includeAction: showSelectRow,
    headers,
    hiddenCols
  })

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    console.log({ row: row.getValue(columnId) })
    const itemRank = rankItem(row.getValue(columnId), value)
    console.log({ itemRank })

    // Store the itemRank info
    addMeta({
      itemRank
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
  }
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    //* Global filters configurations
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: fuzzyFilter
  })

  return (
    <div className="p-2">
      {showGlobalFilter && (
        <div>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 font-lg shadow border border-block"
            placeholder="Search all columns..."
          />
        </div>
      )}
      <table className="">
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
              key={row.id}
              onClick={() => {
                console.log(row.id)
                onRowClick?.(row.id)
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell || [],
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
