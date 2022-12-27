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
  const ovines = currentFarm.animals?.filter(({ type }) => type === 'ovine')
  return (
    <>
      <AnimalsTable
        animalsData={ovines || []}
        onRowClick={onRowClick}
        selectedRow={selectedRow}
      />
    </>
  )
}

export default OvinesTable
