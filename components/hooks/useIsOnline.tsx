import { useEffect, useState } from 'react'

const useIsOnline = () => {
  const [isOnline, setIsOnline] = useState<boolean | undefined>(undefined)
  useEffect(() => {
    const url = 'https://api.adviceslip.com/advice'
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        const json = await response.json()
        console.log(json)
      } catch (error) {
        console.log('error', error)
      }
    }

    fetchData()
  }, [])
  return { isOnline }
}

export default useIsOnline
