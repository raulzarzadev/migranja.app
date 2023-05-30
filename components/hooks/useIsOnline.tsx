import { useEffect, useState } from 'react'

const useIsOnline = () => {
  const [isOnline, setIsOnline] = useState<boolean | undefined>(undefined)
  const time = 30_000 // cada 30 segundos
  const fetchData = async () => {
    const url = 'https://migranja.app/api/hello'
    try {
      const response = await fetch(url)
      if (response.status === 200) {
        setIsOnline(true)
      } else {
        setIsOnline(false)
        console.error('Checking connection: No connection')
      }
    } catch (error) {
      setIsOnline(false)
      console.error('Checking connection: No connection')
      //console.log('error', error)
    }
  }

  useEffect(() => {
    fetchData()
    setInterval(() => {
      fetchData()
    }, time)
  }, [])
  return { isOnline, fetchData }
}

export default useIsOnline
