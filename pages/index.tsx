import type { NextPage } from 'next'
import useAuth from '../components/hooks/useAuth'
import UserHome from '../components/UserHome'
import VisitHome from '../components/VisitHome'

const Home: NextPage = () => {
  const { user } = useAuth()
  return (
    <>
      <div>{user ? <UserHome /> : <VisitHome />}</div>
    </>
  )
}

export default Home
