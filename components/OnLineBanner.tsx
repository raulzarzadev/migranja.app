import Icon from './Icon'
import useIsOnline from './hooks/useIsOnline'

const OnLineBanner = () => {
  const { isOnline, fetchData } = useIsOnline()
  return (
    <div className="mx-2 ">
      {isOnline ? (
        <span className=" bg-success  text-white flex p-1 rounded-md shadow-md uppercase font-semibold px-2">
          <span className="hidden sm:block">En Linea</span>{' '}
          <Icon name="onLine" />
        </span>
      ) : (
        <span
          className="bg-error text-white flex p-1 rounded-md shadow-md uppercase font-semibold px-2"
          onClick={(e) => {
            fetchData()
          }}
        >
          <span className="hidden sm:block">Fuera de linea</span>{' '}
          <Icon name="offLine" />
        </span>
      )}
    </div>
  )
}

export default OnLineBanner
