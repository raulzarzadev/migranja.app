import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Nav from './nav'
import useDebugInformation from '@comps/hooks/useDebugInformation'

export interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  // useDebugInformation('Layout', { children })
  const [isOnline, setIsOnline] = useState()

  return (
    <div className="p-2 prose bg-[url('/assets/images/HomeVisit/waves_pathern.png')] min-h-screen flex flex-col justify-between bg-cover">
      <Nav />
      {isOnline === false && <div>fuera de linea</div>}
      <main className="flex-1">{children}</main>
      <footer className="self-end shadow-md rounded-md w-full ">
        <div className="flex w-full h-20 justify-center items-center flex-col">
          <span className="text-xs ">una app de</span>
          <Link href={'https://raulzarza.com'} className="link">
            RZ
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default Layout
