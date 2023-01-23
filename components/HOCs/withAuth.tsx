import FarmInvitations from '@comps/FarmInvitations'
import FarmVisits from '@comps/FarmVisits'
import useFarm from '@comps/hooks/useFarm'
import useUserFarmPermissions from '@comps/hooks/useUserFarmPermissions'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Home from 'pages'
import { useSelector } from 'react-redux'
import { selectAuthState } from 'store/slices/authSlice'

const withAuth = (Component: any) => {
  const Auth = (props: any) => {
    const {
      query: { farmId },
      pathname
    } = useRouter()

    const user = useSelector(selectAuthState)
    const { farm } = useFarm({ farmId: farmId as string })
    const { userPermissions } = useUserFarmPermissions({ farm })

    //* Determinate Views depends in user have enough permissions to access to this data farm

    if (!user) {
      //* if user is not logged but is in Farm show FarmVisit if farm is public
      if (pathname === '/[farmId]')
        if (farm?.isPublic) return <FarmVisits farm={farm} />
      //* if user is not logged and is in home show Home
      return <Home />
    }

    //* if user is logged

    //* Is in home show FarmsNavigation
    if (pathname === '/') return <Component {...props} />

    //* Is in pathname /['farmId]
    if (pathname === '/[farmId]') {
      //* user have permission as team member or is admin

      if (userPermissions.isActiveTeamMember || userPermissions.isAdmin)
        return <Component {...props} />

      //* user have farm invitation pending from this farm
      if (userPermissions.haveActiveInvitation)
        return (
          <div>
            <FarmInvitations />
            <div className="text-center my-16 text-xl">
              <div>Esta granja no es publica pero tienes una invitacion</div>
            </div>
            {/* <FarmVisits farm={farm} /> */}
          </div>
        )

      //* user have a canceled invitation

      if (userPermissions.haveCanceledInvitation)
        return (
          <div>
            {/* <FarmInvitations /> */}
            <div className="text-center my-16 text-xl">
              <div>Tu invitación a esta granja fue revocada</div>
            </div>
            {/* <FarmVisits farm={farm} /> */}
          </div>
        )

      //* if user is visiting and the farm is public

      if (farm?.isPublic) return <FarmVisits farm={farm} />

      //* if user is visiting, and farm is NOT public show warning and the home
      return (
        <div>
          <div className="text-center text-xl">
            <div>Esta granja ya no es publica</div>
            <Link className="btn btn-outline btn-sm mt-10" href={'/'}>
              Regresar
            </Link>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps
  }

  return Auth
}

export default withAuth
