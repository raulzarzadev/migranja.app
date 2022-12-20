import { FarmType } from '@firebase/Farm/farm.model'
import { updateFarm } from '@firebase/Farm/main'
import Icon from 'components/Icon'
import InvitationStatus from 'components/InvitationStatus'
import ModalDelete from 'components/modal/ModalDelete'
import { deleteField } from 'firebase/firestore'

const FarmTeamTable = ({ farm }: { farm: FarmType | null }) => {
  const handleDeleteMemberTeam = (id: string) => {
    farm?.id &&
      updateFarm(farm?.id, { [`team.${id}`]: deleteField() })
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
  }
  return (
    <div>
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
                  <td>{name}</td>
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
