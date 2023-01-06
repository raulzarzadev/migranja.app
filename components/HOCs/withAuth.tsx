import Home from 'pages'
import { useSelector } from 'react-redux'
import { selectAuthState } from 'store/slices/authSlice'

const withAuth = (Component: any) => {
  const Auth = (props: any) => {
    // Login data added to props via redux-store (or use react context for example)
    const user = useSelector(selectAuthState)
    console.log({ user })

    // If user is not logged in, return login component
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
