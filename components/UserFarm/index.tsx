import FarmNavigation from 'components/FarmNavigation'
import FarmForm from 'components/forms/FarmForm'
import useFarm from 'components/hooks/useFarm'
import { useState } from 'react'

const UserFarm = () => {
  const [editing, setEditing] = useState(false)
  const { userFarm } = useFarm()
  return (
    <div>
      {editing ? (
        <FarmForm farm={userFarm || undefined} setEditing={setEditing} />
      ) : (
        <FarmNavigation farm={userFarm} setEditing={setEditing} />
      )}
    </div>
  )
}

export default UserFarm
