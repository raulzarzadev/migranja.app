import { FarmType } from '@firebase/Farm/farm.model'
import FarmForm from 'components/forms/FarmForm'
import useFarm from 'components/hooks/useFarm'
import Icon from 'components/Icon'
import { useState } from 'react'

const Farm = () => {
  const [editing, setEditing] = useState(false)
  const { farm } = useFarm({ onEditingChange: editing })
  return (
    <div>
      {editing ? (
        <FarmForm farm={farm || undefined} setEditing={setEditing} />
      ) : (
        <FarmInfo farm={farm} setEditing={setEditing} />
      )}
    </div>
  )
}

const FarmInfo = ({
  farm,
  setEditing
}: {
  farm: FarmType | null
  setEditing: (bool: boolean) => void
}) => {
  return (
    <div className="flex w-full bg-base-300 p-2 rounded-md shadow-md justify-evenly mb-2 items-center">
      {farm ? (
        <>
          <div>{farm?.images?.[0]?.url}</div>
          <div>{farm?.name}</div>
          <div>
            Equipo status :{' '}
            {farm.haveATeam ? `Activo (${farm.team.length})` : 'Dasactivado'}
          </div>
          <button
            className="btn btn-circle btn-sm btn-info"
            onClick={() => setEditing(true)}
          >
            <Icon name="edit" size="xs" />
          </button>
        </>
      ) : (
        <div className="flex w-full items-center">
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

export default Farm
