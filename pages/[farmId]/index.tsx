import FarmForm from '@comps/forms/FarmForm'
import FarmNavigation from 'components/FarmNavigation'
import withAuth from 'components/HOCs/withAuth'
import FarmMenu from 'components/UserHome/FarmMenu'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmState, selectUserFarm } from 'store/slices/farmSlice'

const FarmPage = () => {
  const currentFarm = useSelector(selectFarmState)
  const [editing, setEditing] = useState(false)
  const userFarm = useSelector(selectUserFarm)
  return (
    <div className="relative">
      {editing ? (
        <FarmForm farm={userFarm || undefined} setEditing={setEditing} />
      ) : (
        <FarmNavigation
          farm={{ id: currentFarm?.id, name: currentFarm?.name }}
          showGo={undefined}
          setEditing={setEditing}
        />
      )}
      <FarmMenu />
    </div>
  )
}

export default withAuth(FarmPage)
