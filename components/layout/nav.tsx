import Icon from '@comps/Icon'
import UserNotifications from 'components/UserNotifications'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectAuthState } from 'store/slices/authSlice'
import { googleLogin, logout } from '../../firebase/Users/main'
import { UserType } from '../../firebase/Users/user.model'
import OnLineBanner from '@comps/OnLineBanner'
import { Skeleton } from '@mui/material'

export const Nav = () => {
  const user = useSelector(selectAuthState)
  const router = useRouter()

  return (
    <nav className="mb-2">
      <div className="navbar bg-base-300 rounded-lg shadow-md ">
        <div className="flex-1">
          {/* <Link
            className="btn btn-ghost normal-case text-xl btn-sm"
            
          > */}

          <button
            onClick={(e) => {
              e.preventDefault()
              router.push('/')
            }}
            className="flex items-center font-bold btn btn-sm btn-ghost"
          >
            <Icon name="home" size="xs" />
            <span className="ml-1">Mi Granja</span>
          </button>
        </div>
        <OnLineBanner />

        {user === undefined ? (
          <div className="flex items-center">
            <Skeleton
              variant="rectangular"
              width={20}
              height={20}
              className="mx-4"
            />
            <Skeleton variant="circular" width={40} height={40} />
          </div>
        ) : user ? (
          <UserMenu user={user} />
        ) : (
          <div>
            <ul>
              <li>
                <button
                  className="btn btn-sm text-white"
                  onClick={(e) => {
                    e.preventDefault()
                    googleLogin()
                  }}
                >
                  Ingresa
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}

const UserMenu = ({ user }: { user: UserType }) => {
  return (
    <>
      <div className="">
        <UserNotifications />
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              {/* <Link href={'/home'}> */}
              <Image alt="avatar" src={user?.image} width={40} height={40} />
              {/* </Link> */}
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link className="justify-between" href={'/'}>
                Inicio
              </Link>
            </li>
            <li>
              <Link className="justify-between" href={'/home'}>
                Home
                <span className="badge">Nuevo</span>
              </Link>
            </li>
            <li>
              <button
                className="border-error border "
                onClick={(e) => {
                  e.preventDefault()
                  logout()
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Nav
