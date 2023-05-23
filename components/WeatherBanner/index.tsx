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
  const modal = useModal()
  const { getForecastWeather, getCurrentWeather } = useWeather()
  useEffect(() => {
    if (coord) {
      getForecastWeather(coord.lat, coord.lng)
        .then((res) => {
          setFarmWeather(res)
        })
        .catch((err) => console.error(err))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coord])
  const weatherList = farmWeather?.list
  const almostNow = weatherList?.[0]
  return (
    <div className="flex items-center">
      {almostNow ? (
        <button
          className=" btn-ghost btn btn-sm "
          onClick={(e) => {
            e.preventDefault()
            modal.handleOpen()
          }}
        >
          <span className="text-[10px] flex flex-col w-full justify-center items-center lowercase font-bold">
            <span>
              {almostNow.main?.temp.toFixed(0)}°
              <span className="uppercase">C</span>{' '}
              <span>{((almostNow?.pop || 0) * 100).toFixed(0)}%</span>
            </span>
            <span>{almostNow?.weather?.[0]?.description}</span>
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

          {weatherList?.map((weather) => (
            <div key={weather.dt} className="text-xs">
              <div className="my-2">
                <span className="flex w-full justify-between">
                  <span className="font-bold">
                    {isToday(new Date(weather.dt * 1000))
                      ? `Hoy a las ${myFormatDate(
                          new Date(weather.dt * 1000),
                          'HH:mm'
                        )}`
                      : myFormatDate(weather.dt * 1000, 'EE dd MMM HH:mm')}
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
