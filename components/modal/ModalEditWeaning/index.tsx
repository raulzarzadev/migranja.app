import Icon from '@comps/Icon'
import { updateAnimalState } from '@firebase/Animal/main'
import { updateEvent } from '@firebase/Events/main'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import { AnimalStateType } from 'types/base/AnimalState.model'
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
  const animal = farmAnimals.find((animal) => animal.earring === animalEarring)
  const animalId = animal?.id
  const animalMotherId = animal?.parents?.mother?.id
  const [error, setError] = useState('')
  const handleWeaning = async (state: AnimalStateType) => {
    if (!animalId) return setError('No animalId')
    try {
      //* Update animal state
      await updateAnimalState(animalId, state, animal.state)
      //* Update mother animal state
      if (animalMotherId) {
        //* TODO: Check if have more children weaning
        await updateAnimalState(animalMotherId, 'FREE', 'SUCKLE')
      }
      //* Update event status to done
      //@ts-ignore
      await updateEvent(eventId, { 'eventData.status': 'DONE' })
    } catch (error) {
      console.log({ error })
    }
  }
  // console.log({ eventId })

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
            Destetar arete:
            <ModalAnimalDetails earring={animalEarring} size="normal" />
          </span>
          <p>Se realizarán los siguientes movimientos:</p>
          <ul>
            <li className="list-disc">
              Estado del animal Engorda/Venta/Vientre
            </li>
            <li className="list-disc">{`Estado del la madre a "Libre"`}</li>
            <li className="list-disc">
              {`Estado del evento "Destete" como a "Hecho"`}
            </li>
          </ul>
          {error && (
            <div className="bg-error text-error-content p-1 text-sm rounded-md">
              {error}
            </div>
          )}
          <div className="grid  sm:grid-cols-3 gap-2 sm:gap-4 text-center">
            <div>
              <button
                className="btn btn-info mt-5 btn-outline "
                onClick={(e) => {
                  e.preventDefault()
                  handleWeaning('FATTEN')
                }}
              >
                <span className="truncate">Para engorda</span>
              </button>
              <p className="whitespace-pre-wrap text-xs ">
                * Aun no esta listo para vender. Puede ser hembra o macho
              </p>
            </div>
            <div>
              <button
                className="btn btn-info mt-5  btn-outline"
                onClick={(e) => {
                  e.preventDefault()
                  handleWeaning('FOR_SALE')
                }}
              >
                Para venta
              </button>
              <p className="whitespace-pre-wrap text-xs ">
                * Puede ser vendido ahora.
              </p>
            </div>
            <div>
              <button
                className="btn btn-info mt-5  btn-outline"
                onClick={(e) => {
                  e.preventDefault()
                  handleWeaning('FOR_BELLY')
                }}
              >
                Para vientre
              </button>
              <p className="whitespace-pre-wrap text-xs ">
                * Una hembra que formara parte del ganado principal
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ModalEditWeaning
