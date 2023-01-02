import useDebugInformation from 'components/hooks/useDebugInformation'
import type { NextPage } from 'next'
import useAuth from '../components/hooks/useAuth'
import UserHome from '../components/UserHome'
import VisitHome from '../components/VisitHome'
const Home: NextPage = () => {
  const { user } = useAuth()
  useDebugInformation('Home', {})

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
