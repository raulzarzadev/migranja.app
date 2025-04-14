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
      (e) =>
        e.eventData.earring === animal.earring ||
        e.eventData?.parents?.father?.earring === animal.earring ||
        e.eventData?.parents?.mother?.earring === animal.earring
    )
    animal.earring === '241' && console.log({ animalEvents })
    const births = animalEvents.filter((e) => e.type === 'BIRTH')
    const lastBirth = births.sort(
      (a, b) =>
        new Date(b?.eventData.date).getTime() -
        new Date(a?.eventData.date).getTime()
    )[0]
    const lastBirthAgo = getDaysFromNow(lastBirth?.eventData.date)
    return {
      ...animal,
      births,
      lastBirth,
      lastBirthAgo
    }
  })

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
export function getDaysFromNow(dateString: string | number | Date): string {
  if (!dateString) {
    return ''
  }
  const now = new Date()
  const targetDate = new Date(dateString)
  const diffInMs = now.getTime() - targetDate.getTime()
  return `${Math.floor(diffInMs / (1000 * 60 * 60 * 24))}`
}
