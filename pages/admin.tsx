import Dashboard from '@comps/dashboard/Dashboard'
import useDashboardErrors from '@comps/hooks/useDashboardErrors'

import Link from 'next/link'
import { useSelector } from 'react-redux'
import { wrapper } from 'store'

import { selectAuthState } from 'store/slices/authSlice'

const Admin = () => {
  const user = useSelector(selectAuthState)
  useDashboardErrors()

  if (!user?.isAdmin)
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold my-10">Section blocked</h1>
        <Link href={'/'} className="btn btn-outline ">
          Go Start
        </Link>
      </div>
    )
  return (
    <div className="relative">
      <Dashboard />
    </div>
  )
}

export default wrapper.withRedux(Admin)
