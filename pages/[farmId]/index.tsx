import BackupButton from '@comps/BackupButton'
import Icon from '@comps/Icon'
import FarmForm from '@comps/forms/FarmForm'
import FarmNavigation from 'components/FarmNavigation'
import withAuth from 'components/HOCs/withAuth'
import FarmMenu from 'components/UserHome/FarmMenu'
import Head from 'next/head'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmState } from 'store/slices/farmSlice'

const FarmPage = () => {
  const currentFarm = useSelector(selectFarmState)
  const [editing, setEditing] = useState(false)
  return (
    <>
      <Head>
        <title>{currentFarm?.name || ' Granja '}</title>
      </Head>
      <div className="relative">
        {editing ? (
          <div className=" bg-base-300 p-2 rounded-md shadow-md justify-evenly mb-2">
            <div className="flex w-full justify-end">
              <button
                className="btn  btn-xs btn-ghost"
                onClick={(e) => {
                  e.preventDefault()
                  setEditing?.(false)
                }}
              >
                <Icon name="close" />
              </button>
            </div>
            <BackupButton />
            <FarmForm
              farm={currentFarm || undefined}
              setEditing={setEditing}
              onCancel={() => {
                setEditing(false)
              }}
            />
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
    </>
  )
}

export default withAuth(FarmPage)
