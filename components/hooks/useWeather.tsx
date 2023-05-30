import axios from 'axios'

/**
 * @param coordinates  write the default coordinates coordinates
 * @returns {getWeather} a function you can use to know the weather in some coordinates
 */

const useWeather = () => {
  const APIkey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
  async function getForecastWeather(lat: number, lon: number) {
    try {
      const forecast_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=sp`
      const forecast: { data: WeatherResponse } = await axios(forecast_URL)
      return forecast.data
    } catch (error) {
      console.error('get forecast weather fail')
      //console.error(error)
    }
  }
  async function getCurrentWeather(lat: number, lon: number) {
    try {
      const current_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=sp`
      const current: { data: WeatherResponse } = await axios(current_URL)
      return current.data
    } catch (error) {
      console.error('get current weather')
      //console.error(error)
      return null
    }
  }

  return { getForecastWeather, getCurrentWeather }
}

export default useWeather

export interface CurrentWeather {
  coord: Coord
  weather: Weather[]
  base: string
  main: Main
  visibility: number
  wind: Wind
  rain: Rain
  clouds: Clouds
  dt: number
  sys: Sys
  timezone: number
  id: number
  name: string
  cod: number
}

export interface Clouds {
  all: number
}

export interface Coord {
  lon: number
  lat: number
}

export interface Main {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
  sea_level: number
  grnd_level: number
}

export interface Rain {
  '1h': number
}

export interface Sys {
  type: number
  id: number
  country: string
  sunrise: number
  sunset: number
}

export interface Weather {
  id: number
  main: string
  description: string
  icon: string
}

export interface Wind {
  speed: number
  deg: number
  gust: number
}

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
