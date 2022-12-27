import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  getPaginationRowModel,
  FilterFn
} from '@tanstack/react-table'
import GENDER_OPTIONS from 'components/CONSTANTS/GENDER_OPTIONS'
import Icon from 'components/Icon'
import { useEffect, useState } from 'react'
import { myFormatDate } from 'utils/dates/myDateUtils'
import { AnimalType } from '../../firebase/types.model.ts/AnimalType.model'
import { rankItem } from '@tanstack/match-sorter-utils'
import ParentModal from 'components/ParentModal/indext'

export interface AnimalTableType {
  animalsData: Partial<AnimalType>[]
  onRowClick?: ({ id, earring }: { id: string | null; earring: string }) => void
  // onParentClick?: (id: string | null) => void
  selectedRow?: string | null
}
const AnimalsTable = ({
  animalsData,
  onRowClick,
  selectedRow = null
}: // onParentClick
AnimalTableType) => {
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
    state: {
      sorting,
      globalFilter
    },
    filterFns: {
      fuzzy: fuzzyFilter
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel()
  })

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

  return (
    <div className="p-2">
      <div className=" justify-center flex my-2">
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(String(value))}
          className=" input input-sm"
          placeholder="Buscar..."
        />
      </div>
      <div className={`overflow-x-auto ${selectedRow && '  '} mx-auto`}>
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
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`hover cursor-pointer ${
                  row.original.id === selectedRow &&
                  ' border-4 border-base-content'
                } `}
                onClick={() => {
                  onRowClick?.({
                    id: row.original.id,
                    earring: row.original.earring
                  })
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <th key={cell.id} className="font-normal">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </th>
                ))}
              </tr>
            ))}
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

export default AnimalsTable
