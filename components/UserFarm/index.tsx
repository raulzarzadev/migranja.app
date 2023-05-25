import FarmNavigation from 'components/FarmNavigation'
import { useSelector } from 'react-redux'
import { selectUserFarm, selectUserFarms } from 'store/slices/farmSlice'

const UserFarm = () => {
  const userFarm = useSelector(selectUserFarm)
  // console.log({ userFarm })
  return (
    <div>
      <FarmNavigation
        farm={
          userFarm
            ? {
                id: userFarm?.id,
                name: userFarm?.name
              }
            : null
        }
        // setEditing={setEditing}
        showGo={true}
      />
    </div>
  )
}

export const UserFarms = () => {
  const userFarms = useSelector(selectUserFarms)

  return (
    <div>
      {userFarms?.map((farm) => (
        <FarmNavigation key={farm.id} farm={farm} showGo={true} />
      ))}
    </div>
  )
}

export default UserFarm
