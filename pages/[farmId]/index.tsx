import BackupButton from '@comps/BackupButton'
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
  return (
    <div className="relative">
      {editing ? (
        <div className=" bg-base-300 p-2 rounded-md shadow-md justify-evenly mb-2">
          <FarmForm farm={currentFarm || undefined} setEditing={setEditing} />
          <BackupButton />
        </div>
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
