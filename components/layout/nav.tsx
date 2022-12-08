import Head from 'next/head'
import React, { Component } from 'react'
import useAuth from '../hooks/useAuth'

export const Nav = () => {
  const { user } = useAuth()
  return (
    <nav>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <title>Next.js PWA Example</title>

        <link rel="manifest" href="/manifest.json" />
        <link
          href="/icons.icon.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons.icon.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/icons.icon.png"></link>
        <meta name="theme-color" content="#317EFB" />
      </Head>
      <div>Nav</div>
    </nav>
  )
}

export default Nav
