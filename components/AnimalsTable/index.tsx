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
}
const AnimalsTable = ({
  animalsData,
  settings,
  setSelectedRow,
  setSelectedRows,
  selectedRows,
  showRelationshipCol
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
  const extraCols: any[] = []
  if (showRelationshipCol) {
    extraCols.push(
      columnHelper.accessor('relationship.grade', {
        header: 'rel',
        cell: (props) => (
          <span className="flex w-full justify-between">
            {!!props.getValue() ? `${props.getValue()}°` : ''}
          </span>
        )
      })
    )
  }
  const [globalFilter, setGlobalFilter] = useState('')
  const table = useReactTable({
    data: animalsData as any,
    columns: [...extraCols, ...columns],
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      sorting,
      globalFilter
    },
    autoResetPageIndex: false,
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

  useEffect(() => {
    selectedRows && _setSelectedRows(selectedRows)
  }, [selectedRows])

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
      _onSelectNewRow(row?.earring)
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
  const handleSelectAllInFilter = (checked: boolean) => {
    const selected: string[] = checked
      ? (table
          .getFilteredRowModel()
          .rows.map((row) => row.getAllCells()?.[0].getValue()) as string[])
      : []
    _setSelectedRows(selected)
    setSelectedRows?.(selected)
    console.log(selected)
  }
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
        <div className="whitespace-nowrap ml-1">
          {table.getFilteredRowModel().rows.length} de {animalsData.length || 0}
        </div>
      </div>
      <HelperText
        text="Selecciona de uno en uno para ver los detalles. Selecciona varios para editar en grupo. Selecciona todos los que estan filtrados."
        type="info"
      />
      <div className="flex w-full justify-between items-center">
        {settings?.selectMany ? (
          <div
            className="flex from-control
        "
          >
            <label className="label ">
              <input
                type={'checkbox'}
                className="checkbox checkbox-sm"
                onChange={({ target: { checked } }) =>
                  handleSelectMany(checked)
                }
              />
              <span className="label-text ml-1">Seleccionar varios</span>
            </label>

            <label className="label ">
              <input
                type={'checkbox'}
                className="checkbox checkbox-sm"
                onChange={({ target: { checked } }) =>
                  handleSelectAllInFilter(checked)
                }
              />
              <span className="label-text ml-1">Todos</span>
            </label>
          </div>
        ) : (
          ''
        )}
        {!!_selectedRows?.length && (
          <span className="label-text ml-1">
            Seleccionados: {_selectedRows?.length}
          </span>
        )}
        {!!_selectedRow && (
          <span className="label-text ml-1">
            Seleccionado: {_selectedRow.earring}
          </span>
        )}
      </div>
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
              const relationship = row.original?.relationship?.grade

              const itemId = row.original.id
              const itemEarring = row.original.earring
              const isDuplicatedInDb = row.original.isDuplicated
              const isCurrentEarringsDuplicated = earringsDuplicated.find(
                ({ earring }) => earring === itemEarring
              )
              const isEarringRowSelected =
                _selectedRow?.earring === row.original.earring
              const isEarringRowsSelected = _selectedRows?.includes(
                row.original.earring || ''
              )
              const isDuplicated =
                isDuplicatedInDb || isCurrentEarringsDuplicated
              const isSelected = isEarringRowSelected || isEarringRowsSelected

              return (
                <tr
                  key={row.id}
                  className={`hover cursor-pointer`}
                  onClick={() => {
                    _onRowClick?.({
                      id: itemId,
                      earring: itemEarring
                    })
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`font-normal
                      ${isSelected && 'bg-base-300'} 
                      ${isDuplicated && ' bg-error'} 
                      ${
                        showRelationshipCol &&
                        relationship === 1 &&
                        'bg-rose-400'
                      }
                      ${
                        showRelationshipCol &&
                        relationship === 2 &&
                        'bg-rose-300'
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
