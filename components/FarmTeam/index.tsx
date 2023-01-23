import { MemberTeam } from '@firebase/Farm/farm.model'
import FarmTeamTable from 'components/FarmTeamTable'
import FarmTeamForm, {
  TeamMemberFormType
} from 'components/forms/FarmTeamForm.tsx'
import SearchUserForm from 'components/forms/SearchUserForm'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmState } from 'store/slices/farmSlice'

const FarmTeam = () => {
  const farm = useSelector(selectFarmState)
  const [showForm, setShowForm] = useState(false)
  const [teamMember, setTeamMember] = useState<TeamMemberFormType>()

  const handleSetMember = (user: MemberTeam | null) => {
    setShowForm(true)
    if (user) {
      setTeamMember({ name: user?.name || '', id: user.id, email: user.email })
    }
  }

  return (
    <div>
      <h2 className="text-center font-bold ">Miembros del equipo</h2>
      <FarmTeamTable farm={farm || null} />
      <SearchUserForm setNewUser={handleSetMember} />

      {showForm && (
        <FarmTeamForm
          teamMember={teamMember}
          handleHideFrom={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

export default FarmTeam
