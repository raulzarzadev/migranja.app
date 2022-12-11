import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel
} from '@tanstack/react-table'
import GENDER_OPTIONS from 'components/CONSTANTS/GENDER_OPTIONS'
import { FemaleOptions, MaleOptions } from 'components/forms/AnimalForm'
import Icon from 'components/Icon'
import { useEffect, useState } from 'react'
import { myFormatDate } from 'utils/dates/myDateUtils'
import { getOvines } from '../../firebase/Animal/main'
import { AnimalType } from '../../firebase/types.model.ts/AnimalType.model'

// TODO crear tarjeta de animal y editarla en el mismo lugar
const AnimalsTable = ({
  onRowClick,
  selectedRow
}: {
  onRowClick?: (id: string | null) => void
  selectedRow?: string
}) => {
  const [data, setData] = useState<AnimalType[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const columnHelper = createColumnHelper<AnimalType>()
  useEffect(() => {
    getOvines().then((res: AnimalType[]) => setData(res))
    return () => setData([])
  }, [])
  const columns = [
    columnHelper.accessor('earring', {
      header: 'Arete'
    }),
    columnHelper.accessor('gender', {
      header: 'Sexo',
      cell: (props) => <span>{GENDER_OPTIONS[props.getValue()]?.label}</span>
    }),
    columnHelper.accessor('birthday', {
      header: 'Nac',
      cell: (props) => (
        <span>
          {props.getValue() ? myFormatDate(props.getValue(), 'dd-MMM-yy') : '-'}
        </span>
      )
    }),
    columnHelper.accessor('status', {
      header: 'Status'
    }),

    columnHelper.accessor('parents', {
      header: 'Padres',
      cell: (props) => (
        <span className="flex w-full justify-between">
          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onRowClick?.(props.getValue()?.father?.earring ?? null)
            }}
          >
            <span className="text-info">
              <Icon size="xs" name="male" />
            </span>
            <span className="truncate">
              {props.getValue()?.father?.earring}
            </span>
          </button>

          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onRowClick?.(props.getValue()?.mother?.earring ?? null)
            }}
          >
            <span className="text-pink-00">
              <Icon size="xs" name="female" />
            </span>
            <span className="truncate">
              {props.getValue()?.mother?.earring}
            </span>
          </button>
        </span>
      )
    })
  ]
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting
  })

  console.log(data)

  return (
    <div className="p-2">
      <table className="mx-aut table table-compact w-full  ">
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
              className={`hover cursor-pointer  ${
                selectedRow === row.original.id ?? 'bg-black'
              }`}
              onClick={() => {
                onRowClick?.(row.original.id)
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
      <div className="h-4" />
    </div>
  )
}

export default AnimalsTable
