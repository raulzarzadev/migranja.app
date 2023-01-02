import AnimalCard from 'components/AnimalCard'
import AnimalsTable, { RowSelectedType } from 'components/AnimalsTable'
import useFarm from 'components/hooks/useFarm'
import { useState } from 'react'
import AnimalsOptions from './AnimalsOptions'

const OvinesTable = () => {
  const { farmAnimals } = useFarm()
  const ovines = farmAnimals.filter(({ type }) => type === 'ovine')
  const [selectedRow, setSelectedRow] = useState<RowSelectedType | null>(null)
  const [selectedRows, setSelectedRows] = useState<string[] | null>(null)
  return (
    <div className="flex flex-col w-full  lg:flex-row">
      <div className=" bg-base-300 shadow-md rounded-md m-2 lg:w-1/2 h-min">
        <AnimalsTable
          animalsData={ovines || []}
          selectedRows={selectedRows}
          setSelectedRow={setSelectedRow}
          setSelectedRows={setSelectedRows}
          settings={{ selectMany: true }}
        />
      </div>
      <div className=" bg-base-300 shadow-md rounded-md m-2 lg:w-1/2 h-min">
        {selectedRow && <AnimalCard animalId={selectedRow.id} />}
        {selectedRows && (
          <AnimalsOptions
            animalsEarrings={selectedRows}
            setAnimalsEarrings={setSelectedRows}
          />
        )}
      </div>
    </div>
  )
}

export default OvinesTable
