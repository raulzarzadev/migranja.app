import InstallButton from 'components/InstallButton'
import UserNotifications from 'components/UserNotifications'
import Image from 'next/image'
import Link from 'next/link'
import React, { Component } from 'react'
import { googleLogin, logout } from '../../firebase/Users/main'
import { UserType } from '../../firebase/Users/user.model'
import useAuth from '../hooks/useAuth'

export const Nav = () => {
  const { user } = useAuth()
  return (
    <nav className="mb-2">
      <div className="navbar bg-base-300 rounded-lg shadow-md ">
        <div className="flex-1">
          <Link className="btn btn-ghost normal-case text-xl btn-sm" href={'/'}>
            MiRanchito
          </Link>
        </div>
        <div>
          <InstallButton />
        </div>

        {user ? (
          <UserMenu user={user} />
        ) : (
          <div>
            <ul>
              <li>
                <button
                  className="btn"
                  onClick={(e) => {
                    e.preventDefault()
                    googleLogin()
                  }}
                >
                  Login with google
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
              <Link href={'/'}>
                <Image alt="avatar" src={user?.image} width={40} height={40} />
              </Link>
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            {/* <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li> */}
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
