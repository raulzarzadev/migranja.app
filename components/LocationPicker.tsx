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
  process.env
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  })

  const [map, setMap] = useState(null)

  const onLoad = useCallback(
    function callback(map: any) {
      // This is just an example of getting and using the map instance!!! don't just blindly copy!
      const bounds = new window.google.maps.LatLngBounds(center)
      map.fitBounds(bounds)
      setMap(map)
    },
    [center]
  )

  const onUnmount = useCallback(function callback() {
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
