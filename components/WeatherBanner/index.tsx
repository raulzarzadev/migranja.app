import useModal from '@comps/hooks/useModal'
import useWeather, {
  CurrentWeather,
  WeatherResponse
} from '@comps/hooks/useWeather'
import Modal from '@comps/modal'
import { isToday } from 'date-fns'
import { useEffect, useState } from 'react'
import { myFormatDate } from 'utils/dates/myDateUtils'

export interface Coordinates {
  lat: number
  lng: number
}
const WeatherBanner = ({ coord }: { coord?: Coordinates }) => {
  const [farmWeather, setFarmWeather] = useState<WeatherResponse>()
  const [currentFarmWeather, setCurrentFarmWeather] = useState<
    CurrentWeather | undefined | any
  >()
  const modal = useModal()
  const { getForecastWeather, getCurrentWeather } = useWeather()
  useEffect(() => {
    if (coord) {
      getCurrentWeather(coord.lat, coord.lng)
        .then((res) => {
          setCurrentFarmWeather(res)
        })
        .catch((err) => console.error(err))

      getForecastWeather(coord.lat, coord.lng)
        .then((res) => {
          setFarmWeather(res)
        })
        .catch((err) => console.error(err))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coord])
  const weatherList = farmWeather?.list
  console.log({ currentFarmWeather: currentFarmWeather })
  return (
    <div className="flex items-center">
      {currentFarmWeather ? (
        <button
          className=" btn-ghost btn btn-sm "
          onClick={(e) => {
            e.preventDefault()
            modal.handleOpen()
          }}
        >
          <span className="text-[10px] flex flex-col w-full justify-center items-center lowercase ">
            <span>
              {currentFarmWeather.main?.temp.toFixed(0)}°
              <span className="uppercase">C</span>{' '}
              {/* <span>{((currentFarmWeather?.pop || 0) * 100).toFixed(0)}%</span> */}
            </span>
            <span>{currentFarmWeather?.weather?.[0]?.description}</span>
          </span>
        </button>
      ) : null}
      <Modal {...modal} title={`Clima`}>
        <>
          <h4>
            Pronostico del clima cerca de:
            <span className="font-bold"> {farmWeather?.city.name} </span>
          </h4>
          <p>
            Proximos: <span className="font-bold">5 días</span>{' '}
          </p>
          <div className="text-center">
            <span className="text-sm italic ">
              Fecha, hora, probablidad de lluvia, descripción del clima,
              temperatura ahora, maxima y minima,
            </span>
          </div>
          <div className="flex w-full justify-center">
            <span className="mx-1">Ahora: </span>
            <span className="mx-1">
              {currentFarmWeather?.weather?.[0].description}
            </span>
            <span className="mx-1">
              {currentFarmWeather?.main.temp.toFixed(0)}°C
            </span>
            {'-'}
            <span className="mx-1">
              {currentFarmWeather?.main.feels_like.toFixed(0)}°C
            </span>
          </div>
          {weatherList?.map((weather) => (
            <div key={weather.dt} className="text-xs">
              <div className="my-2">
                <span className="flex w-full justify-between">
                  <span className="font-bold">
                    {isToday(new Date(weather.dt_txt))
                      ? `Hoy a las ${myFormatDate(weather.dt_txt, 'HH:mm')}`
                      : myFormatDate(weather.dt_txt, 'EE dd MMM HH:mm')}
                  </span>
                  <span className="">
                    <span className="font-bold">
                      {((weather.pop || 0) * 100).toFixed(0)}%{' '}
                    </span>
                  </span>

                  <span>
                    <span className="font-bold ">
                      {weather.weather?.[0].description}
                    </span>{' '}
                  </span>
                </span>
                <div className="flex justify-around">
                  <div>
                    <p>{weather.main.temp.toFixed(0)} °C</p>
                  </div>
                  <div>
                    <p> {weather.main.temp_min.toFixed(0)} °C</p>
                  </div>
                  <div>
                    <p>{weather.main.temp_max.toFixed(0)} °C</p>
                  </div>
                </div>
              </div>
              <hr />
            </div>
          ))}
        </>
      </Modal>
    </div>
  )
}

export default WeatherBanner
