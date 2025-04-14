//import MyTable from '@comps/MyTable'
import AnimalsTable from 'components/AnimalsTable'
// import AnimalsTable from '@comps/MyTables/AnimalsTable'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmEvents } from 'store/slices/farmSlice'
import AnimalsOptions from './AnimalsOptions'

const OvinesTable = () => {
  const farmAnimals = useSelector(selectFarmAnimals)
  const events = useSelector(selectFarmEvents)
  const formattedAnimalsWithBirths = farmAnimals.map((animal) => {
    const animalEvents = events.filter(
      (e) => e.eventData.earring === animal.earring
    )
    return {
      ...animal,
      events: animalEvents
    }
  })
  console.log(
    '241 events',
    events.filter((e) => e.eventData.earring === '241')
  )
  const [selectedRows, setSelectedRows] = useState<string[] | null>(null)
  return (
    <>
      <div>
        <h2 className="text-center text-lg font-bold ">Lista de borregas</h2>
        <AnimalsTable
          animalsData={formattedAnimalsWithBirths}
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
