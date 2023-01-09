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
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'
import { AnimalType } from '../../firebase/types.model.ts/AnimalType.model'
import { rankItem } from '@tanstack/match-sorter-utils'
import ParentModal from 'components/ParentModal/indext'
import { getDuplicatedEarrings } from 'components/BatchTable/batch.helpers'
import DebouncedInput from 'components/inputs/DebouncedInput'
import HelperText from 'components/HelperText'
import IndeterminateCheckbox from './IndeterminableCheckbox'
export interface RowSelectedType {
  id?: string
  earring?: string
}

export interface AnimalsDataType extends Partial<AnimalType> {
  relationship?: {
    grade?: number
    type?: string
  }
}
export interface AnimalTableType {
  animalsData: AnimalsDataType[]
  setSelectedRows?: (rows: string[] | null) => void
  setSelectedRow?: (row: RowSelectedType | null) => void
  settings?: {
    selectMany?: boolean
  }
  selectedRows?: string[] | null
  showRelationshipCol?: boolean
  showSelectRow?: boolean
}
const AnimalsTable = ({
  animalsData,
  settings,
  setSelectedRow,
  setSelectedRows,
  selectedRows,
  showRelationshipCol,
  showSelectRow
}: AnimalTableType) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const columnHelper = createColumnHelper<AnimalsDataType>()

  const columns = [
    columnHelper.accessor('earring', {
      header: 'Arete'
    }),
    columnHelper.accessor('batch', {
      header: 'Lote'
    }),
    columnHelper.accessor('gender', {
      header: 'Sexo',
      cell: (props) => (
        <span>{GENDER_OPTIONS[props.getValue() || 'female']?.label}</span>
      )
    }),
    columnHelper.accessor('birthday', {
      header: 'Edad',
      cell: (props) => (
        <span>
          {props.getValue()
            ? props.getValue() && fromNow(props.getValue(), { unit: 'month' })
            : '-'}
        </span>
      )
    }),

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
  const extraCols: any[] = []

  if (showSelectRow) {
    extraCols.push({
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
  if (showRelationshipCol) {
    extraCols.push(
      columnHelper.accessor('relationship', {
        header: 'rel',
        cell: (props) => (
          <span className="flex w-full justify-between  flex-col">
            <span>
              {!!props.getValue() ? `${props.getValue()?.grade}°` : ''}
            </span>
            <span className="text-xs">
              {!!props.getValue() ? `${props.getValue()?.type}` : ''}
            </span>
          </span>
        )
      })
    )
  }

  const [rowSelection, setRowSelection] = useState({})
  useEffect(() => {
    let earrings: string[] = []
    Object.entries(rowSelection).forEach(([i, bool]: any) => {
      const newEarring = animalsData[i].earring
      earrings.push(newEarring || '')
    })
    setSelectedRows?.(earrings)
    if (earrings.length === 1) {
      const animal = animalsData.find(({ earring }) => earring === earrings[0])
      setSelectedRow?.({ id: animal?.id, earring: animal?.earring })
    } else {
      setSelectedRow?.(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection])

  console.log({ rowSelection })

  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data: animalsData as any,
    columns: [...extraCols, ...columns],
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      sorting,
      globalFilter,
      rowSelection
    },
    onRowSelectionChange: setRowSelection,
    autoResetPageIndex: false,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel()
  })

  const earringsDuplicated = getDuplicatedEarrings(animalsData)
  return (
    <div className="p-2">
      <div className=" justify-center flex my-2 items-center w-full">
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(String(value))}
          className=" input input-sm w-full input-bordered"
          placeholder="Buscar..."
        />
      </div>
      <HelperText
        text="Selecciona de uno en uno para ver los detalles. Selecciona varios para editar en grupo. Selecciona todos los que estan filtrados."
        type="info"
      />
      {showSelectRow && (
        <div className="text-center">
          {Object.keys(rowSelection).length} of{' '}
          {table.getPreFilteredRowModel().rows.length} Seleccionados
        </div>
      )}

      <div className={`overflow-x-auto  mx-auto`}>
        <table className="mx-aut table table-compact mx-auto w-full  ">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    {...{
                      className: header.column.getCanSort()
                        ? '!z-0 cursor-pointer select-none'
                        : '!z-0  ',
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
              const relationshipGrade = row.original?.relationship?.grade
              const itemEarring = row.original.earring
              const isDuplicatedInDb = row.original.isDuplicated
              const isCurrentEarringsDuplicated = earringsDuplicated.find(
                ({ earring }) => earring === itemEarring
              )

              const isDuplicated =
                isDuplicatedInDb || isCurrentEarringsDuplicated

              return (
                <tr
                  key={row.id}
                  className={`border-2 border-transparent hover:border-info cursor-pointer `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`font-normal 
                      ${isDuplicated && ' bg-error bg-opacity-50'}
                      ${relationshipGrade === 1 && 'bg-red-500 bg-opacity-70'} 
                      ${relationshipGrade === 2 && 'bg-red-400 bg-opacity-70'} 
                      ${
                        showRelationshipCol &&
                        relationshipGrade === 1 &&
                        'bg-rose-400 bg-opacity-70'
                      }
                      ${
                        showRelationshipCol &&
                        relationshipGrade === 2 &&
                        'bg-rose-300 bg-opacity-70'
                      }
                      `}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
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
          <button
            className="btn btn-outline btn-sm btn-square mx-2"
            onClick={(e) => {
              e.preventDefault()
              table.previousPage()
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <Icon name="left" size="xs" />
          </button>
          <button
            className="btn btn-outline btn-sm btn-square mx-2"
            onClick={(e) => {
              e.preventDefault()
              table.nextPage()
            }}
            disabled={!table.getCanNextPage()}
          >
            <Icon name="right" size="xs" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnimalsTable
