import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip
} from 'recharts'
import Title from './Title'
import { myFormatDate } from 'utils/dates/myDateUtils'
import { AnimalType } from 'types/base/AnimalType.model'
import { listenAppAnimals } from '@firebase/Animal/main'

interface ChartData {
  date: string
  newAnimals: number
}

const newAnimalsToChartData = (animals: AnimalType[]): ChartData[] => {
  let animalsGroup: any = {}
  animals.forEach((animal) => {
    const createdAt = animal.createdAt

    // Verificar si la fecha ya existe como una clave en el objeto de usuarios agrupados
    if (animalsGroup.hasOwnProperty(createdAt)) {
      // Incrementar el contador de nuevos usuarios para esa fecha
      animalsGroup[createdAt].newAnimals += 1
    } else {
      // Crear un nuevo objeto con la fecha y contador de nuevos usuarios
      animalsGroup[createdAt] = {
        date: myFormatDate(createdAt, 'ddMMM'),
        newAnimals: 1
      }
    }
  })

  // Obtener los valores del objeto animalsGroup como un array
  const animalsGroupArray: ChartData[] = Object.values(animalsGroup)

  // Imprimir el array de usuarios agrupados por fecha con el contador
  return animalsGroupArray
}

export default function NewAnimalsChart() {
  const theme = useTheme()
  const [data, setData] = React.useState<ChartData[]>([])
  React.useEffect(() => {
    listenAppAnimals((res: AnimalType[]) => {
      setData(newAnimalsToChartData(res))
    })
  }, [])

  return (
    <React.Fragment>
      <Title>Animales ({data.length})</Title>
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
              Animales
            </Label>
          </YAxis>
          <Tooltip></Tooltip>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="newAnimals"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  )
}
