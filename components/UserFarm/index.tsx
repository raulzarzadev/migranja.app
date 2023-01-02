import FarmForm from 'components/forms/FarmForm'
import useFarm from 'components/hooks/useFarm'
import UserFarmNavigation from 'components/UserFarmNavigation'
import { useState } from 'react'

const UserFarm = () => {
  const [editing, setEditing] = useState(false)
  const { userFarm } = useFarm()
  // useDebugInformation('UserFarm', {})
  return (
    <div>
      {editing ? (
        <FarmForm farm={userFarm || undefined} setEditing={setEditing} />
      ) : (
        <UserFarmNavigation setEditing={setEditing} />
      )}
    </div>
  )
}

export default UserFarm
