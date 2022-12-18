import FarmTeamForm from 'components/forms/FarmTeamForm.tsx'

const FarmTeam = () => {
  return (
    <div>
      <FarmTeamTable farm={farm} />

      <SearchUserForm setNewUser={handleSetMember} />
      {showForm && <FarmTeamForm />}
    </div>
  )
}

export default FarmTeam
