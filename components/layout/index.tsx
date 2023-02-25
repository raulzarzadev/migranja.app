import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import Nav from './nav'

export interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="p-2 prose bg-[url('/assets/images/HomeVisit/waves_pathern.png')] min-h-screen flex flex-col justify-between bg-cover">
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta
          name="description"
          content="Centraliza, organiza y administra tu granja de forma eficiente. Incrementa tus utilidades"
        />
        <meta
          name="keywords"
          content="farm, ranchito, miRanchito, migranja granja, crianza de animales, borregos"
        />
        <title>Mi Granja</title>
        <link rel="manifest" href="/manifest.json" />
        <link
          href="/assets/icons/icon-48x48.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/assets/icons/icon-152x152.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="apple-touch-icon"
          href="/assets/icons/icon-152x152.png"
        ></link>
        <meta name="theme-color" content="#C6B386" />
      </Head>

      <Nav />
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
