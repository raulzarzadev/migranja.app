import { FarmType } from '@firebase/Farm/farm.model'
import { getUserFarm } from '@firebase/Farm/main'
import FarmForm from 'components/forms/FarmForm'
import useFarm from 'components/hooks/useFarm'
import Icon from 'components/Icon'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const UserFarm = () => {
  const [editing, setEditing] = useState(false)
  const { userFarm } = useFarm()
  return (
    <div>
      {editing ? (
        <FarmForm farm={userFarm || undefined} setEditing={setEditing} />
      ) : (
        <FarmInfo farm={userFarm} setEditing={setEditing} />
      )}
    </div>
  )
}

const FarmInfo = ({
  farm,
  setEditing
}: {
  farm?: FarmType | null
  setEditing: (bool: boolean) => void
}) => {
  const farmTeam =
    farm?.team && Object.entries(farm?.team).map(([key, value]) => value)
  return (
    <div className="flex w-full bg-base-300 p-2 rounded-md shadow-md justify-between mb-2 items-center">
      {farm ? (
        <>
          {/* <div>{farm?.images?.[0]?.url}</div> */}
          <div>{farm?.name}</div>
          <div>
            Equipo status :{' '}
            {farm.haveATeam
              ? `Activo (${farmTeam?.length ?? 0})`
              : 'Dasactivado'}
          </div>
          <button
            className="btn btn-circle btn-sm btn-info"
            onClick={() => setEditing(true)}
          >
            <Icon name="edit" size="xs" />
          </button>
          <div>
            <Link href={`/${farm.id}`} className="btn btn-sm  mr-1">
              ir
            </Link>
          </div>
        </>
      ) : (
        <div className="flex w-full items-center justify-center">
          <div>No haz configurado una granja aún </div>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setEditing(true)}
          >
            Configurar
          </button>
        </div>
      )}
    </div>
  )
}

export default UserFarm
