import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { wrapper } from '../store'
import Layout from '../components/layout'
import useAuth from 'components/hooks/useAuth'
import useFarmState from 'components/hooks/useFarmState'
import { useEffect } from 'react'
import useIsOnline from '@comps/hooks/useIsOnline'

function MyApp({ Component, pageProps }: AppProps) {
  useAuth() // Set user state in redux store
  useFarmState() // Set the farm state, farm info, farm animals , and events
  useIsOnline()
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default wrapper.withRedux(MyApp)
