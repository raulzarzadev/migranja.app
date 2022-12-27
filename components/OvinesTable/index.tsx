import { listenFarmOvines } from '@firebase/Animal/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import AnimalsTable, { AnimalTableType } from 'components/AnimalsTable'
import useFarm from 'components/hooks/useFarm'
import { useEffect, useState } from 'react'

const OvinesTable = ({
  onRowClick,
  selectedRow
}: Omit<AnimalTableType, 'animalsData'>) => {
  const { currentFarm } = useFarm()
  const [ovines, setOvines] = useState<AnimalType[]>([])

  // TODO: listen farm ovines, or farm animals. Pero solo aquellos con permisos suficientes deberian poder leer datos.
  // ¿donde porner estos permisos?
  // una funcion que evalue los permisos del usuario en cada peticion y basada en estos traiga resultados
  // una funcion asi, donde se pone, en cada solicitud. y se le pasa un objeto con los permisos

  useEffect(() => {
    currentFarm?.id &&
      listenFarmOvines(currentFarm?.id, (res: AnimalType[]) => setOvines(res))
    return () => setOvines([])
  }, [currentFarm?.id])
  return (
    <>
      <AnimalsTable
        animalsData={ovines}
        onRowClick={onRowClick}
        selectedRow={selectedRow}
      />
    </>
  )
}

export default OvinesTable
