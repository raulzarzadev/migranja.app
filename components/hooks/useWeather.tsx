import axios from 'axios'

/**
 * @param coordinates  write the default coordinates coordinates
 * @returns
 */

const useWeather = () => {
  const APIkey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
  async function getWeather(lat: number, lon: number) {
    try {
      //const api = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&cnt=${GET_DAYS}`
      const api = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}}&units=metric`
      const res: WeatherResponse = await axios(api)
      return res
    } catch (error) {
      console.error(error)
    }
  }

  return { getWeather }
}

export default useWeather

export interface WeatherResponse {
  cod: string
  message: number
  cnt: number
  list?: ListEntity[] | null
  city: City
}
export interface ListEntity {
  dt: number
  main: Main
  weather?: WeatherEntity[] | null
  clouds: Clouds
  wind: Wind
  visibility: number
  pop: number
  rain?: Rain | null
  sys: Sys
  dt_txt: string
}
export interface Main {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  sea_level: number
  grnd_level: number
  humidity: number
  temp_kf: number
}
export interface WeatherEntity {
  id: number
  main: string
  description: string
  icon: string
}
export interface Clouds {
  all: number
}
export interface Wind {
  speed: number
  deg: number
  gust: number
}
export interface Rain {
  '3h': number
}
export interface Sys {
  pod: string
}
export interface City {
  id: number
  name: string
  coord: Coord
  country: string
  population: number
  timezone: number
  sunrise: number
  sunset: number
}
export interface Coord {
  lat: number
  lon: number
}
