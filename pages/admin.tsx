import Link from 'next/link'
import { useSelector } from 'react-redux'
import { selectAuthState } from 'store/slices/authSlice'

const Admin = () => {
  const user = useSelector(selectAuthState)
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
    <div>
      <div></div>
    </div>
  )
}

export default Admin
