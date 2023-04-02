import FarmNavigation from 'components/FarmNavigation'
import FarmForm from 'components/forms/FarmForm'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUserFarm } from 'store/slices/farmSlice'

const UserFarm = () => {
  const userFarm = useSelector(selectUserFarm)
  // console.log({ userFarm })
  return (
    <div>
      <FarmNavigation
        farm={
          userFarm
            ? {
                id: userFarm?.id,
                name: userFarm?.name
              }
            : null
        }
        // setEditing={setEditing}
        showGo={true}
      />
    </div>
  )
}

export default UserFarm
