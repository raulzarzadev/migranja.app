//import MyTable from '@comps/MyTable'
import AnimalsTable from 'components/AnimalsTable'
// import AnimalsTable from '@comps/MyTables/AnimalsTable'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import AnimalsOptions from './AnimalsOptions'

const OvinesTable = () => {
  const farmAnimals = useSelector(selectFarmAnimals)
  const [selectedRows, setSelectedRows] = useState<string[] | null>(null)
  return (
    <>
      <div>
        <h2 className="text-center text-lg font-bold ">Lista de borregas</h2>
        <AnimalsTable
          animalsData={farmAnimals}
          //selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          settings={{ selectMany: true }}
          showSelectRow
        />
        {/*
        //* custon animal table 
        <AnimalsTable /> 
        */}
        {!!selectedRows?.length && (
          <div className=" bg-base-300 shadow-md rounded-md m-2 ">
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
