import { useEffect, useState } from 'react'

const useIsOnline = () => {
  const [isOnline, setIsOnline] = useState<boolean | undefined>(undefined)
  const time = 30_000 // cada 30 segundos
  useEffect(() => {
    //  const url = 'http://localhost:3000/api/hello'
    const url = 'https://migranja.app/api/hello'
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        if (response.status === 200) {
          setIsOnline(true)
        } else {
          setIsOnline(false)
        }
      } catch (error) {
        setIsOnline(false)
        console.log('error', error)
      }
    }

    setInterval(() => {
      fetchData()
    }, time)
  }, [])
  return { isOnline }
}

export default useIsOnline
