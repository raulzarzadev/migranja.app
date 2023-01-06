import FarmNavigation from 'components/FarmNavigation'
import FarmForm from 'components/forms/FarmForm'
import UserFarmNavigation from 'components/UserFarmNavigation'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmState, selectUserFarm } from 'store/slices/farmSlice'

const UserFarm = () => {
  const [editing, setEditing] = useState(false)
  const userFarm = useSelector(selectUserFarm)
  return (
    <div>
      {editing ? (
        <FarmForm farm={userFarm || undefined} setEditing={setEditing} />
      ) : (
        <FarmNavigation farm={userFarm} setEditing={setEditing} showGo={true} />
      )}
    </div>
  )
}

export default UserFarm
