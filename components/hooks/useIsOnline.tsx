import { useEffect, useState } from 'react'

const useIsOnline = () => {
  const [isOnline, setIsOnline] = useState<boolean | undefined>(undefined)
  useEffect(() => {
    const url = 'http://localhost:3000/api/hello'
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        console.log(response)
      } catch (error) {
        console.log('error', error)
      }
    }

    fetchData()
  }, [])
  return { isOnline }
}

export default useIsOnline
