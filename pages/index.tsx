import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectAuthState } from 'store/slices/authSlice'

import VisitHome from '../components/VisitHome'
const Home: NextPage = () => {
  const user = useSelector(selectAuthState)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.replace('/home')
    }
  }, [router, user])

  return (
    <>
      <div>
        <span className="hidden">Home view</span>
        <VisitHome />
      </div>
    </>
  )
}

export default Home
