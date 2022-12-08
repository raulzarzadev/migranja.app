import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React, { Component } from 'react'
import useAuth from '../hooks/useAuth'

export const Nav = () => {
  const { user } = useAuth()
  return (
    <nav>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">daisyUI</a>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <Link href={'/'}>
                  <Image
                    alt="avatar"
                    src={user?.image}
                    width={40}
                    height={40}
                  />
                </Link>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav
