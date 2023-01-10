import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { AnimalDetails } from 'components/AnimalCard'
import Icon from 'components/Icon'
import Modal from 'components/modal'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmOvines } from 'store/slices/farmSlice'

const ParentModal = ({
  parentReference,
  type
}: {
  parentReference?: string
  type: 'father' | 'mother'
}) => {
  const ovines = useSelector(selectFarmOvines)

  const [parentData, setParentData] = useState<AnimalType | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }
  const handleOpenParent = (parentReference: string) => {
    // can be a id or a earring
    // console.log(parentReference)
    const parent = [...ovines].find(
      ({ earring, id }) => earring === parentReference || id === parentReference
    )
    setOpenModal(true)
    setParentData(parent || null)
  }
  return (
    <div>
      {parentReference && (
        <button
          className=" flex flex-col justify-center items-center  "
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            handleOpenParent(parentReference)
          }}
        >
          {type === 'father' ? (
            <div className="text-info">
              <Icon size="xs" name="male" />
            </div>
          ) : (
            <div className="text-pink-400">
              <Icon size="xs" name="female" />
            </div>
          )}
          <div className="truncate text-xs font-normal">{parentReference}</div>
        </button>
      )}
      <Modal
        title={`Información de ${type === 'father' ? 'a madre' : 'l Padre'}`}
        open={openModal}
        handleOpen={handleOpenModal}
      >
        <div>
          {parentData ? (
            <AnimalDetails
              animal={parentData}
              // setEditing={() => {}}
            />
          ) : (
            <div>No hay información sobre el padre</div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default ParentModal
