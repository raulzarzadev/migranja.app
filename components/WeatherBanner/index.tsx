import useWeather, { WeatherResponse } from '@comps/hooks/useWeather'
import { useEffect, useState } from 'react'

export interface Coordinates {
  lat: number
  lng: number
}
const WeatherBanner = ({ coord }: { coord?: Coordinates }) => {
  const [farmWeather, setFarmWeather] = useState<WeatherResponse>()
  const { getWeather } = useWeather()
  useEffect(() => {
    if (coord) {
      getWeather(coord.lat, coord.lng)
        .then((res) => {
          setFarmWeather(res)
        })
        .catch((err) => console.error(err))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coord])
  return (
    <div>
      {farmWeather ? (
        <button>temp: {farmWeather?.list?.[0].main?.temp}</button>
      ) : null}
    </div>
  )
}

export default WeatherBanner
