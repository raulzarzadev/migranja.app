import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { memo, useCallback, useEffect, useState } from 'react'

export interface Location {
  lat: number
  lng: number
}

function LocationPicker({
  location,
  setLocation
}: {
  location: Location
  setLocation: (coord: Location) => void
}) {
  const [center, setCenter] = useState(location)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyChGGTMisnbRri0Vv7Ug6AQXUsGWxzK6jE'
  })

  const [map, setMap] = useState(null)

  const onLoad = useCallback(
    function callback(map) {
      // This is just an example of getting and using the map instance!!! don't just blindly copy!
      const bounds = new window.google.maps.LatLngBounds(center)
      map.fitBounds(bounds)
      setMap(map)
    },
    [center]
  )

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
    <GoogleMap
      //  mapContainerStyle={containerStyle}
      mapContainerClassName="w-full aspect-square"
      center={center}
      zoom={6}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <>
        <div className="">
          <Marker
            draggable
            position={center}
            onDragEnd={(e) => {
              setCenter({
                lat: e.latLng?.lat() || 0,
                lng: e.latLng?.lng() || 0
              })
              setLocation({
                lat: e.latLng?.lat() || 0,
                lng: e.latLng?.lng() || 0
              })
            }}
          />
        </div>
      </>
    </GoogleMap>
  ) : (
    <></>
  )
}

export default memo(LocationPicker)
