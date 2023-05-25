import { useEffect, useState } from 'react'
import useWeather, { WeatherResponse } from './useWeather'
export interface Coordinates {
  lat: number
  lng: number
}
const useFarmWeather = ({
  farmCoordinates
}: {
  farmCoordinates?: Coordinates
}) => {
  const [farmWeather, setFarmWeather] = useState<WeatherResponse>()
  const { getForecastWeather } = useWeather()
  useEffect(() => {
    farmCoordinates &&
      getForecastWeather(farmCoordinates?.lat, farmCoordinates?.lng)
        .then((res) => {
          setFarmWeather(res)
        })
        .catch((err) => console.error(err))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmCoordinates])
  return farmWeather
}

export default useFarmWeather
