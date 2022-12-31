import { deleteAnimal } from '@firebase/Animal/main'
import useFarm from 'components/hooks/useFarm'
import ModalDelete from 'components/modal/ModalDelete'
import { useEffect, useState } from 'react'

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
  const { currentFarm } = useFarm()
  const [progress, setProgress] = useState(0)

  const animalsIds = _earrings.map(
    (earring) =>
      currentFarm?.animals?.find((animal) => animal.earring === earring)?.id
  )
  const handleDeleteAll = async () => {
    setProgress(1)
    try {
      // animalsIds.forEach(async (id, i) => {
      //   await deleteAnimal(id as string).then((res) => console.log(res))
      //   setProgress((i * 100) / animalsIds.length)
      // })
      for (let i = 0; i < animalsIds.length; i++) {
        const id = animalsIds[i]
        await deleteAnimal(id as string).then((res) => console.log(res))
        setProgress((i * 100) / animalsIds.length)
      }
      setProgress(100)
      _setEarrings([])
      setAnimalsEarrings?.([])
    } catch (error) {
      console.log(error)
      setProgress(0)
    }
  }
  return (
    <div className="p-2">
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
          <button className="btn btn-info btn-outline" disabled>
            Editar
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnimalsOptions
