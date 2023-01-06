import Icon from 'components/Icon'
import Link from 'next/link'

const FarmNavigation = ({ farm, showGo, setEditing }) => {
  return (
    <div>
      <div className="flex w-full bg-base-300 p-2 rounded-md shadow-md justify-between mb-2 items-center">
        {farm ? (
          <>
            {/* <div>{farm?.images?.[0]?.url}</div> */}
            <div>{farm?.name}</div>
            <div className="flex w-[110px] justify-between  items-center">
              {setEditing && (
                <button
                  className="btn btn-circle btn-sm btn-info"
                  onClick={() => setEditing?.(true)}
                >
                  <Icon name="edit" size="xs" />
                </button>
              )}

              {showGo && (
                <Link href={`/${farm.id}`} className="btn btn-sm  mr-1">
                  ir
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="flex w-full items-center justify-center">
            <div>No haz configurado una granja aún </div>
            {setEditing && (
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setEditing?.(true)}
              >
                Configurar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FarmNavigation
