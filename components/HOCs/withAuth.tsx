import FarmVisits from '@comps/FarmVisits'
import useFarm from '@comps/hooks/useFarm'
import { useRouter } from 'next/router'
import Home from 'pages'
import { useSelector } from 'react-redux'
import { selectAuthState } from 'store/slices/authSlice'

const withAuth = (Component: any) => {
  const Auth = (props: any) => {
    const {
      query: { farmId }
    } = useRouter()
    // Login data added to props via redux-store (or use react context for example)
    const user = useSelector(selectAuthState)
    //console.log({ farm })
    // console.log({ user })
    const { farm } = useFarm({ farmId: farmId as string })
    // If user is not logged in, return login component
    if (farmId && !user) {
      return <FarmVisits farm={farm} />
    }
    if (!user) {
      return <Home />
    }

    // If user is logged in, return original component
    return <Component {...props} />
  }

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps
  }

  return Auth
}

export default withAuth
