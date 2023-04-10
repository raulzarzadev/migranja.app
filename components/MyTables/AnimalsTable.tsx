import MyTable from '@comps/MyTable'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'

const AnimalsTable = () => {
  const farmAnimals = useSelector(selectFarmAnimals)
  const tableData = farmAnimals.map((animal) => ({
    ...animal,
    birthday: myFormatDate(animal.birthday, 'dd MMM yy'),
    age: fromNow(animal.birthday, { addSuffix: true })
  }))
  const [rowsSelected, setRowsSelected] = useState([])
  return (
    <div>
      <MyTable
        rowsSelected={rowsSelected}
        columns={[
          { id: 'earring', label: 'Arete' },
          { id: 'birthday', label: 'Fec.Nac' },
          { id: 'age', label: 'Arete' }
        ]}
        rows={{
          data: tableData
        }}
      />
    </div>
  )
}

export default AnimalsTable
