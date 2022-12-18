import Icon from 'components/Icon'
import InvitationStatus from 'components/InvitationStatus'
import ModalDelete from 'components/modal/ModalDelete'

const FarmTeamTable = ({ farm }) => {
  return (
    <div>
      <table className="table table-compact mx-auto mt-2">
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
              ([key, { name, email, id, invitation }], index) => (
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
