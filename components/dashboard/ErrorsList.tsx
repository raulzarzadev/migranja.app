import * as React from 'react'
import Link from '@mui/material/Link'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Title from './Title'
import { ErrorType, listenErrors } from '@firebase/Errors/main'
import { myFormatDate } from 'utils/dates/myDateUtils'

// Generate Order Data
function createData(
  id: number,
  date: string,
  name: string,
  shipTo: string,
  paymentMethod: string,
  amount: number
) {
  return { id, date, name, shipTo, paymentMethod, amount }
}

function preventDefault(event: React.MouseEvent) {
  event.preventDefault()
}

export default function ErrorsList() {
  const [rows, setRows] = React.useState<ErrorType[]>([])
  React.useEffect(() => {
    listenErrors((res) => {
      setRows(res)
    })
  }, [])

  return (
    <React.Fragment>
      <Title>Recent Errors</Title>
      <div className="overflow-x-auto">
        <Table size="small" className="overflow-x-auto">
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Mensaje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {myFormatDate(row.createdAt, 'dd MMM yy HH:mm:ss')}
                </TableCell>
                <TableCell>{row.userId}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more ErrorsList
      </Link>
    </React.Fragment>
  )
}
