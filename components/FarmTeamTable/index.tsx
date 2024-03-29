import { FarmType } from '@firebase/Farm/farm.model'
import { updateFarm } from '@firebase/Farm/main'
import Icon from 'components/Icon'
import InvitationStatus from 'components/InvitationStatus'
import ModalDelete from 'components/modal/ModalDelete'
import { deleteField } from 'firebase/firestore'

const FarmTeamTable = ({ farm }: { farm: FarmType | null }) => {
  const handleDeleteMemberTeam = async (id: string) => {
    try {
      const res = await updateFarm(farm?.id as string, {
        [`team.${id}`]: deleteField()
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }
  return (
    <div className="w-full overflow-auto">
      <table className="table table-compact mx-auto mt-2 w-full overflow-auto">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>email</th>
            <th>ops</th>
            <th>inv</th>
          </tr>
        </thead>
        <tbody>
          {farm?.team &&
            Object?.entries(farm?.team).map(
              ([key, { name, email, id, invitation }]: any, index) => (
                <tr key={id}>
                  <th>{name}</th>
                  <td>{email}</td>
                  <td>
                    <div className="flex">
                      <ModalDelete
                        handleDelete={() => handleDeleteMemberTeam(id)}
                        title={'Eliminar animal'}
                        buttonLabel={null}
                        openModalItem={(props) => (
                          <button
                            {...props}
                            className="btn btn-circle btn-xs btn-error"
                          >
                            <Icon name="delete" size="xs" />
                          </button>
                        )}
                      />
                    </div>
                  </td>
                  <td>
                    <InvitationStatus farmId={farm.id} userId={id} />
                  </td>
                </tr>
              )
            )}
        </tbody>
      </table>
    </div>
  )
}

export default FarmTeamTable
