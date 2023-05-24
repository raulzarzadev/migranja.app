import type { NextPage } from 'next'

import VisitHome from '../components/VisitHome'
import Head from 'next/head'
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Mi Granja</title>
      </Head>
      <div>
        <span className="hidden">Home view</span>
        <VisitHome />
      </div>
    </>
  )
}

export default Home
