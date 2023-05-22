import { useEffect, useState } from 'react'
import axios from 'axios'
import useFarm from './useFarm'
import useCurrentFarm from './useCurrentFarm'
interface UseWeather {
  lat?: number
  lon?: number
}
/**
 *
 * @param coordinates  write the default coordinates coordinates
 * @returns
 */
const useWeather = () => {
  const APIkey = '30c62a413f36d5319fdb21a607e0f38e'
  const farm = useCurrentFarm()
  const [currentFarmWeather, setCurrentFarmWeather] = useState<any>(undefined)

  async function getWeather(lat: number, lon: number) {
    try {
      const api = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`
      const res = await axios(api)
      setCurrentFarmWeather(res)
      console.log({ res })
      return res
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (farm?.coordinates) {
      getWeather(farm?.coordinates?.lat, farm.coordinates?.lon)
    }
  }, [farm?.coordinates])

  return { getWeather, currentFarmWeather }
}

export default useWeather
