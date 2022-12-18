import { FarmType } from '@firebase/Farm/farm.model'
import { getInvitationsFarm, updateFarm } from '@firebase/Farm/main'
import FarmNavigation from 'components/FarmNavigation'
import useAuth from 'components/hooks/useAuth'
import { useEffect, useState } from 'react'

const FarmInvitations = () => {
  const [farmInvitations, setFarmInvitations] = useState<FarmType[]>([])
  const { user } = useAuth()

  useEffect(() => {
    console.log(user?.id)
    user?.id &&
      getInvitationsFarm(user.id).then((res) => setFarmInvitations(res))
  }, [user])

  return (
    <div>
      {farmInvitations.map((farm, i) => (
        <FarmNavigation key={i} farm={farm} />
      ))}
    </div>
  )
}

export default FarmInvitations
