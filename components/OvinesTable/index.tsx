import AnimalsTable, { RowSelectedType } from 'components/AnimalsTable'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import AnimalsOptions from './AnimalsOptions'

const OvinesTable = () => {
  const farmAnimals = useSelector(selectFarmAnimals)
  const [selectedRows, setSelectedRows] = useState<string[] | null>(null)
  console.log({ selectedRows })
  return (
    <>
      <div className="w-full bg-base-300 shadow-md rounded-md m-2  h-min ">
        <AnimalsTable
          animalsData={farmAnimals}
          //selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          settings={{ selectMany: true }}
          showSelectRow
        />
        {!!selectedRows?.length && (
          <div className=" bg-base-300 shadow-md rounded-md m-2 lg:w-1/2 h-min">
            <AnimalsOptions
              animalsEarrings={selectedRows}
              setAnimalsEarrings={setSelectedRows}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default OvinesTable
