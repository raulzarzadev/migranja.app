import { deleteAnimal } from '@firebase/Animal/main'
import ChooseEventForm from 'components/forms/ChooseEventForm'
import Icon from 'components/Icon'
import Modal from 'components/modal'
import ModalDelete from 'components/modal/ModalDelete'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import FormEarringsSelected from '../forms/FormEarringsSelected'

const AnimalsOptions = ({
  animalsEarrings,
  title,
  setAnimalsEarrings
}: {
  animalsEarrings: string[]
  title?: string
  setAnimalsEarrings?: ([]) => void
}) => {
  //const [_earrings, _setEarrings] = useState<string[]>([])

  // useEffect(() => {
  //   _setEarrings(animalsEarrings)
  //   return () => {
  //     setProgress(0)
  //   }
  // }, [animalsEarrings])

  const farmAnimals = useSelector(selectFarmAnimals)
  const earringsSelected = animalsEarrings.map((earring) => {
    const animal = farmAnimals?.find((animal) => animal.earring === earring)
    return {
      earring: animal?.earring || '',
      id: animal?.id || '',
      name: animal?.name || ''
    }
  })

  const [progress, setProgress] = useState(0)

  const animalsIds = earringsSelected.map((animal) => animal.id)

  const handleDeleteAll = async () => {
    setProgress(1)

    try {
      const deletePromises = animalsIds.map((animal, i) => {
        setProgress(50 * (i / animalsIds.length))
        if (animal) return deleteAnimal(animal)
      })
      setProgress(50)
      const res = await Promise.all(deletePromises)
      // console.log(res)
      setProgress(100)
      // _setEarrings([])
      // setAnimalsEarrings?.([])
    } catch (error) {
      console.log(error)
      setProgress(0)
    }
  }
  const [openEvent, setOpenEvent] = useState(false)
  const handleOpenEvent = () => {
    setOpenEvent(!openEvent)
  }
  const [openEditSelection, setOpenEditSelection] = useState(false)
  const handleOpenEditSelection = () => {
    setOpenEditSelection(!openEditSelection)
  }

  return (
    <div className="p-2">
      <Modal
        title="Registrar evento"
        handleOpen={handleOpenEvent}
        open={openEvent}
      >
        <ChooseEventForm animalsIds={animalsIds} title={title} />
      </Modal>
      <Modal
        title={`Editar aretes`}
        handleOpen={handleOpenEditSelection}
        open={openEditSelection}
      >
        <FormEarringsSelected earringsSelected={earringsSelected} />
      </Modal>
      <div className="flex  items-center justify-evenly flex-col h-full text-center w-full ">
        <span>
          Estos cambios se aplicaran a todos los animales seleccionados
          <span className="font-bold">{animalsEarrings.length || 0}</span>
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
          <button
            className="btn btn-info btn-outline"
            onClick={() => {
              handleOpenEditSelection()
            }}
          >
            Editar
            <span className="ml-2">
              <Icon name="edit" />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnimalsOptions
