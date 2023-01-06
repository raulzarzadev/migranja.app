import useAuth from 'components/hooks/useAuth'
import type { NextPage } from 'next'
import { useSelector } from 'react-redux'
import { selectAuthState } from 'store/slices/authSlice'

import UserHome from '../components/UserHome'
import VisitHome from '../components/VisitHome'
const Home: NextPage = () => {
  const { user } = useAuth()
  //useDebugInformation('Home', {})

  return (
    <>
      <div>
        <span className="hidden">Home view</span>
        {user ? <UserHome /> : <VisitHome />}
      </div>
    </>
  )
}

export default Home
