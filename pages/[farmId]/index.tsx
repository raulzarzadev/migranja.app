import FarmNavigation from 'components/FarmNavigation'
import withAuth from 'components/HOCs/withAuth'
import FarmMenu from 'components/UserHome/FarmMenu'
import { useSelector } from 'react-redux'
import { selectFarmState } from 'store/slices/farmSlice'

const FarmPage = () => {
  const currentFarm = useSelector(selectFarmState)

  return (
    <div>
      <FarmNavigation
        farm={{ id: currentFarm?.id, name: currentFarm?.name }}
        showGo={undefined}
        setEditing={undefined}
      />
      <FarmMenu />
    </div>
  )
}

// export const WithPermissions = (Component: any) => {
//   const Permissions = (props: any) => {
//     const currentFarm = useSelector(selectFarmState)
//     const {
//       userPermissions: { isAdmin, isActiveTeamMember }
//     } = useUserFarmPermissions({
//       farm: currentFarm
//     })
//     if (!isAdmin && !isActiveTeamMember)
//       return (
//         <div className="text-center ">
//           No tienes permisos suficientes <VisitHome />
//         </div>
//       )

//     return <Component {...props} />
//   }

//   // Copy getInitial props so it will run as well
//   if (Component.getInitialProps) {
//     Permissions.getInitialProps = Component.getInitialProps
//   }
//   return Permissions
// }

export default withAuth(FarmPage)
