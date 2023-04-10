import * as React from 'react'

import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'

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

const defaultData: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
    weight: {
      atBirth: 3,
      atWeaning: 12,
      at6Months: 24
    }
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
    images: [{ url: 'http://localhost/image', description: 'imagen de prueba' }]
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10
  }
]

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.group({
    id: 'hello',
    header: () => <span>Hello</span>,
    // footer: props => props.column.id,
    columns: [
      columnHelper.accessor('firstName', {
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id
      }),
      columnHelper.accessor((row) => row.lastName, {
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id
      })
    ]
  }),
  columnHelper.group({
    header: 'Info',
    footer: (props) => props.column.id,
    columns: [
      columnHelper.accessor('age', {
        header: () => 'Age',
        footer: (props) => props.column.id
      }),
      columnHelper.group({
        header: 'More Info',
        columns: [
          columnHelper.accessor('visits', {
            header: () => <span>Visits</span>,
            footer: (props) => props.column.id
          }),
          columnHelper.accessor('status', {
            header: 'Status',
            footer: (props) => props.column.id
          }),
          columnHelper.accessor('progress', {
            header: 'Profile Progress',
            footer: (props) => props.column.id
          })
        ]
      })
    ]
  })
]

function MyTable<T>({ data = [] }: { data: T[] }) {
  const { columns } = getColumnsFromData(data)
  console.log({ columns })
  //const [data, setData] = React.useState(() => [...defaultData])
  const rerender = React.useReducer(() => ({}), {})[1]
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  console.log({ table })

  return (
    <div className="p-2">
      <table className="table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef?.header || [],
                        header.getContext()
                      )}
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

type Column = {
  id?: string
  header?: any
  footer?: any
  columns?: Column[]
  cell?: (info: any) => any
}

type ColumnGroup = {
  id?: string
  header?: any
  footer?: any
  columns?: Column[]
}

function getColumnsFromData(data: any[]) {
  const columns: any[] = []
  const columnHelper = createColumnHelper()
  const obj = data?.[0] || {}
  const keys = Object.keys(obj)
  // Display Column
  columns.push(
    columnHelper.display({
      id: 'actions',
      cell: (props) => <span key={props.row.id}> action</span> // RowActions
    })
  )

  keys.forEach((key) => {})
  return { columns }
}
// function transformData<T>(data: T[]) {
//   const columnDefs: ColumnGroup[] = []
//   const flatData: any[] = []

//   function flattenData(rowData: any, groupHeaders?: any[]) {
//     const flatRow: any = {}
//     for (const key in rowData) {
//       if (rowData.hasOwnProperty(key)) {
//         const value = rowData[key]
//         if (typeof value === 'object' && value !== null) {
//           const newHeaders = groupHeaders ? [...groupHeaders, key] : [key]
//           flattenData(value, newHeaders)
//         } else {
//           flatRow[key] = value
//         }
//       }
//     }

//     if (flatRow) {
//       flatData.push(flatRow)
//     }
//   }

//   // Flatten data
//   data.forEach((row) => flattenData(row))

//   // Build column defs
//   const headerKeys = new Set(Object.keys(flatData[0]))
//   headerKeys.forEach((key) => {
//     const isNested = key.includes('.')
//     const [headerKey, subHeaderKey] = isNested ? key.split('.') : [key]

//     let group = columnDefs.find((colGroup) => colGroup.id === headerKey)
//     if (!group) {
//       group = { id: headerKey, columns: [] }
//       columnDefs.push(group)
//     }

//     if (isNested) {
//       let subGroup = group.columns?.find(
//         (colGroup) => colGroup.id === subHeaderKey
//       )
//       if (!subGroup) {
//         subGroup = { id: subHeaderKey }
//         group.columns?.push({ columns: [subGroup] })
//       }

//       subGroup.columns?.push({ id: key })
//     } else {
//       group.columns?.push({ id: key })
//     }
//   })

//   // Build cells
//   const cells = flatData.map((row) => {
//     const cellsRow: { [key: string]: any } = {}
//     Object.keys(row).forEach((key) => {
//       cellsRow[key] = {
//         value: row[key]
//       }
//     })
//     return cellsRow
//   })

//   // Build column accessor
//   const columnAccessor: ColumnGroup = {
//     columns: columnDefs
//   }

//   return { cells, columnDefs: columnAccessor }
// }
