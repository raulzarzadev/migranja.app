import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer
} from 'recharts'
import Title from './Title'
import { listenAppUsers } from '@firebase/Users/main'
import { myFormatDate } from 'utils/dates/myDateUtils'
import { UserType } from '@firebase/Users/user.model'

// const data = [
//   createData('00:00', 0),
//   createData('03:00', 300),
//   createData('06:00', 600),
//   createData('09:00', 800),
//   createData('12:00', 1500),
//   createData('15:00', 2000),
//   createData('18:00', 2400),
//   createData('21:00', 2400),
//   createData('24:00', undefined)
// ]

interface ChartData {
  date: string
  newUsers: number
}

const usersToNewUsersChartData = (users: UserType[]): ChartData[] => {
  let usersGroup: any = {}
  users.forEach((user) => {
    const createdAt = user?.createdAt

    // Verificar si la fecha ya existe como una clave en el objeto de users Group
    if (usersGroup.hasOwnProperty(createdAt)) {
      // Incrementar el contador de nuevos users para esa fecha
      usersGroup[createdAt].newUsers += 1
    } else {
      // Crear un nuevo objeto con la fecha y contador de nuevos users
      usersGroup[createdAt] = {
        date: myFormatDate(createdAt, 'ddMMM'),
        newUsers: 1
      }
    }
  })

  // Obtener los valores del objeto usersGroup como un array
  const usersGroupArray: ChartData[] = Object.values(usersGroup)

  // Imprimir el array de users Group por fecha con el contador
  return usersGroupArray
}

export default function NewUsersChart() {
  const theme = useTheme()
  const [data, setData] = React.useState<ChartData[]>([])
  React.useEffect(() => {
    listenAppUsers((res: UserType[]) => {
      setData(usersToNewUsersChartData(res))
    })
  }, [])

  return (
    <React.Fragment>
      <Title>Usuarios ({data.length})</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24
          }}
        >
          <XAxis
            dataKey="date"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1
              }}
            >
              Usuarios
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="newUsers"
            stroke={theme.palette.primary.main}
            dot={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  )
}
