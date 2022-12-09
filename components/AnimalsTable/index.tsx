import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { getOvines } from '../../firebase/Animal/main'
import { AnimalType } from '../../firebase/types.model.ts/AnimalType.model'

const AnimalsTable = () => {
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
      header: 'Sexo'
    }),
    columnHelper.accessor('birthday', {
      header: 'Nac'
    }),
    columnHelper.accessor('status', {
      header: 'Status'
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
    <div>
      <table className="mx-auto">
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
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
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
