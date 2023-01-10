import { deleteAnimal } from '@firebase/Animal/main'
import ChooseEventForm from 'components/forms/ChooseEventForm'
import Icon from 'components/Icon'
import Modal from 'components/modal'
import ModalDelete from 'components/modal/ModalDelete'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'

const AnimalsOptions = ({
  animalsEarrings,
  setAnimalsEarrings
}: {
  animalsEarrings: string[]
  setAnimalsEarrings?: ([]) => void
}) => {
  const [_earrings, _setEarrings] = useState<string[]>([])
  useEffect(() => {
    _setEarrings(animalsEarrings)
    return () => {
      setProgress(0)
    }
  }, [animalsEarrings])
  const farmAnimals = useSelector(selectFarmAnimals)
  const [progress, setProgress] = useState(0)

  const animalsIds = _earrings.map(
    (earring) =>
      farmAnimals?.find((animal) => animal.earring === earring)?.id || ''
  )
  const handleDeleteAll = async () => {
    setProgress(1)

    try {
      const deletePromises = animalsIds.map((animal, i) => {
        setProgress((i * 100) / animalsIds.length)
        if (animal) return deleteAnimal(animal)
      })
      setProgress(50)
      const res = await Promise.all(deletePromises)
      // console.log(res)
      setProgress(100)
      _setEarrings([])
      setAnimalsEarrings?.([])
    } catch (error) {
      console.log(error)
      setProgress(0)
    }
  }
  const [openEvent, setOpenEvent] = useState(false)
  const handleOpenEvent = () => {
    setOpenEvent(!openEvent)
  }
  return (
    <div className="p-2">
      <Modal
        title="Registrar evento"
        handleOpen={handleOpenEvent}
        open={openEvent}
      >
        <ChooseEventForm animalsIds={animalsIds} />
      </Modal>
      <div className="flex  items-center justify-evenly flex-col h-full text-center w-full ">
        <span>
          Estos cambios se aplicaran a todos los animales selecciondos
        </span>
        <div className="flex w-full justify-evenly ">
          <ModalDelete
            title="Eliminar"
            handleDelete={() => handleDeleteAll()}
            buttonLabel={null}
            text={`Eliminaras todos los animales seleccionados total: ${animalsIds.length}`}
          >
            {progress > 0 && (
              <div>
                Eliminando
                <div>
                  <progress value={progress} max={100}></progress>
                </div>
              </div>
            )}
          </ModalDelete>
          <button
            className="btn btn-info btn-outline"
            onClick={(e) => {
              e.preventDefault()
              handleOpenEvent()
            }}
          >
            Evento
            <span className="ml-2">
              <Icon name="event" />
            </span>
          </button>
          <button className="btn btn-info btn-outline" disabled>
            Editar
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnimalsOptions
