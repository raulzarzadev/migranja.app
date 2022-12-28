import { deleteAnimal } from '@firebase/Animal/main'
import ModalDelete from 'components/modal/ModalDelete'

const AnimalsOptions = ({
  animalsIds,
  setAnimalsIds
}: {
  animalsIds: string[]
  setAnimalsIds?: ([]) => void
}) => {
  const handleDeleteAll = async () => {
    const promises = animalsIds.map((id) => {
      return deleteAnimal(id)
    })
    return await Promise.all(promises)
      .then((res) => {
        setAnimalsIds?.([])
        return true
      })
      .catch((err) => {
        console.log(err)
        return false
      })
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
          />
          <button className="btn btn-info btn-outline" disabled>
            Editar
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnimalsOptions
