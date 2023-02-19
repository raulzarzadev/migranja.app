import Icon from '@comps/Icon'
import { updateAnimalState } from '@firebase/Animal/main'
import { updateEvent } from '@firebase/Events/main'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import Modal from '..'
import ModalAnimalDetails from '../ModalAnimalDetails'

const ModalEditWeaning = ({
  eventId,
  animalEarring
}: {
  eventId: string
  animalEarring?: string
}) => {
  const [openEditEvent, setOpenEditEvent] = useState(false)
  const handleOpenEditEvent = () => {
    setOpenEditEvent(!openEditEvent)
  }
  const farmAnimals = useSelector(selectFarmAnimals)
  const animalId = farmAnimals.find(
    (animal) => animal.earring === animalEarring
  )?.id
  return (
    <>
      <button
        className="text-info"
        onClick={(e) => {
          e.preventDefault()
          handleOpenEditEvent()
        }}
      >
        <Icon name="edit" />
      </button>
      <Modal
        open={openEditEvent}
        handleOpen={handleOpenEditEvent}
        title="Editar destete"
      >
        <div className="flex flex-col w-full justify-center items-center my-5">
          <span>
            Destetar arete <ModalAnimalDetails earring={animalEarring} />
          </span>
          <div className="grid grid-cols-3 gap-4">
            <button
              className="btn btn-info mt-5 btn-outline"
              onClick={(e) => {
                e.preventDefault()
                if (animalId) {
                  updateAnimalState(animalId, 'FATTEN')
                }

                // @ts-ignore

                updateEvent(eventId, { 'eventData.status': 'DONE' })
              }}
            >
              Para engorda
            </button>
            <button
              className="btn btn-info mt-5  btn-outline"
              onClick={(e) => {
                e.preventDefault()
                if (animalId) {
                  updateAnimalState(animalId, 'FOR_SALE')
                }

                // @ts-ignore

                updateEvent(eventId, { 'eventData.status': 'DONE' })
              }}
            >
              Para venta
            </button>
            <button
              className="btn btn-info mt-5  btn-outline"
              onClick={(e) => {
                e.preventDefault()
                if (animalId) {
                  updateAnimalState(animalId, 'FOR_BELLY')
                }

                // @ts-ignore

                updateEvent(eventId, { 'eventData.status': 'DONE' })
              }}
            >
              Para vientre
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ModalEditWeaning
