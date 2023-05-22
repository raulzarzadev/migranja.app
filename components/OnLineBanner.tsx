import Icon from './Icon'
import useIsOnline from './hooks/useIsOnline'

const OnLineBanner = () => {
  const { isOnline } = useIsOnline()
  return (
    <div className="mx-2 ">
      {isOnline ? (
        <span className=" bg-success  text-white flex p-1 rounded-md shadow-md uppercase font-semibold px-2">
          En Linea <Icon name="onLine" />
        </span>
      ) : (
        <span className="bg-error text-white flex p-1 rounded-md shadow-md uppercase font-semibold px-2">
          Fuera de linea <Icon name="offLine" />
        </span>
      )}
    </div>
  )
}

export default OnLineBanner
