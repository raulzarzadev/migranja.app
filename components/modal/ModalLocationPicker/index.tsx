import useModal from '@comps/hooks/useModal'
import Modal from '..'
import LocationPicker from '@comps/LocationPicker'
import { useState } from 'react'
import Icon from '@comps/Icon'

export interface Location {
  lat: number
  lng: number
}
const ModalLocationPicker = ({
  location,
  setLocation
}: {
  location: Location
  setLocation: (coord: Location) => void
}) => {
  const modal = useModal()
  const [_location, _setLocation] = useState<Location>({ ...location })

  return (
    <div>
      <button
        onClick={(e) => {
          e.preventDefault()
          modal.handleOpen()
        }}
        className="btn btn-ghost"
      >
        Ubicación{' '}
        <span>
          <Icon name="location" />
        </span>
      </button>
      <Modal {...modal} title="Modal">
        <LocationPicker setLocation={_setLocation} location={_location} />
        <div>
          <span>Ubicación seleccionada: </span>
          <span className="font-bold">{location.lat.toFixed(3)}, </span>
          <span className="font-bold"> {location.lng.toFixed(3)}</span>
        </div>
        <button
          className="btn mx-auto my-2 text-center "
          onClick={(e) => {
            e.preventDefault()
            setLocation(_location)
          }}
        >
          Seleccionar ubicación{' '}
        </button>
      </Modal>
    </div>
  )
}

export default ModalLocationPicker
