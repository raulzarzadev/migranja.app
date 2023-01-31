import UserFarm from 'components/UserFarm'
import FarmInvitations from 'components/FarmInvitations'
import H2 from '@comps/Basics/Title2'

const UserHome = () => {
  return (
    <>
      <H2>Mi granja</H2>
      <UserFarm />
      <FarmInvitations />
    </>
  )
}

export default UserHome
