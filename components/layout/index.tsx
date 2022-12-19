import Head from 'next/head'
import React, { useEffect } from 'react'
import Nav from './nav'
export interface LayoutProps {
  children: React.ReactNode
}
const games = [
  {
    slug: 'lost-in-cyberspace',
    name: 'Lost in Cyberspace',
    author: 'Zosia and Bartek',
    twitter: 'bartaz',
    website: '',
    github: 'github.com/bartaz/lost-in-cyberspace'
  },
  {
    slug: 'vernissage',
    name: 'Vernissage',
    author: 'Platane',
    twitter: 'platane_',
    website: 'github.com/Platane',
    github: 'github.com/Platane/js13k-2017'
  },
  {
    slug: 'coconutty',
    name: 'Coconutty',
    author: 'Mary Knize',
    twitter: 'captainpainway',
    website: 'maryknize.com',
    github: 'github.com/captainpainway/coconutty'
  },
  {
    slug: 'lost-pacman',
    name: 'Lost Pacman',
    author: 'MarcGuinea',
    twitter: 'MarcGuineaCasas',
    website: 'marcguinea.com',
    github: 'github.com/mguinea/lost-pacman'
  },
  {
    slug: 'polyhedron-runner',
    name: 'Polyhedron Runner',
    author: 'Alex Swan',
    twitter: 'BoldBigflank',
    website: 'bold-it.com',
    github: 'github.com/BoldBigflank/js13k-polyhedron'
  },
  {
    slug: 'she-is-my-universe',
    name: 'She is my universe',
    author: 'Madmarcel',
    twitter: 'madmarcel',
    website: '',
    github: 'github.com/madmarcel/js13k2017'
  },
  {
    slug: 'spacewrecked',
    name: 'Spacewrecked',
    author: 'Sorskoot',
    twitter: 'Sorskoot',
    website: 'timmykokke.com',
    github: 'github.com/sorskoot/js13kgames_2017_Lost'
  },
  {
    slug: 'shifted-dimensions',
    name: 'Shifted Dimensions',
    author: 'Nylki',
    twitter: 'nylk',
    website: 'github.com/nylki',
    github: 'github.com/nylki/shifted-dimensions'
  }
]
function Layout({ children }: LayoutProps) {
  return (
    <div className="p-2 prose">
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
          content="farm, ranchito, granja, crianza de animales, borregos"
        />
        <title>Mi Ranchito</title>

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
      <button id="notifications">Request dummy notifications</button>

      <Nav />
      <main className="">{children}</main>
    </div>
  )
}

export default Layout
