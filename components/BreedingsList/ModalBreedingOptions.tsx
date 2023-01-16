import Icon from '@comps/Icon'
import Modal from '@comps/modal'
import ModalDelete from '@comps/modal/ModalDelete'
import SearchEarring from '@comps/SearchEarring'
import {
  addAnimalToBreedingBatchEvent,
  deleteEvent
} from '@firebase/Events/main'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import { BreedingEventCardDetails } from 'types/base/FarmEvent.model'

const ModalBreedingOptions = ({
  breeding
}: {
  breeding: BreedingEventCardDetails
}) => {
  const farmAnimals = useSelector(selectFarmAnimals)

  const [openOptions, setOpenOptions] = useState(false)
  const handleOpenOptions = () => {
    setOpenOptions(!openOptions)
  }
  const handleDelete = async () => {
    const res = await deleteEvent(breeding?.id)
    return console.log(res)
  }
  const [openModalToAddEarring, setOpenModalToAddEarring] = useState(false)
  const handleOpenModalToAddEarring = () => {
    setOpenModalToAddEarring(!openModalToAddEarring)
  }
  const handleAddEarring = ({ earring }: { earring: string }) => {
    // console.log({ earring })
    const animal = farmAnimals.find((animal) => animal.earring === earring)
    animal
      ? addAnimalToBreedingBatchEvent(breeding.id, animal)
      : console.log('error finding animal')
  }

  return (
    <div>
      <button
        className="btn btn-circle btn-xs btn-warning"
        onClick={(e) => {
          e.preventDefault()
          handleOpenOptions()
        }}
      >
        <Icon name="settings" size="xs" />
      </button>

      <Modal
        title="Opciones de monta"
        open={openOptions}
        handleOpen={handleOpenOptions}
      >
        <div className="flex w-full justify-around my-10">
          <div>
            <button
              className="btn btn-outline btn-sm btn-info "
              onClick={(e) => {
                e.preventDefault()
                handleOpenModalToAddEarring()
              }}
            >
              agregar arete
            </button>
          </div>
          <Modal
            title="Agregar arete"
            open={openModalToAddEarring}
            handleOpen={handleOpenModalToAddEarring}
          >
            <div>
              <h2>
                Busca aretes que ya esten registrados para agregarlos a esta
                monta. (solo apareceran hembras)
              </h2>
              <div className="">
                <SearchEarring
                  placeholder="Buscar hembras"
                  omitEarrings={breeding?.eventData?.breedingBatch?.map(
                    (animal: any) => animal?.earring
                  )}
                  gender="female"
                  onEarringClick={(earring) => handleAddEarring(earring)}
                  relativeTo={breeding.eventData.breedingMale?.earring}
                />
              </div>
            </div>
          </Modal>
          <ModalDelete
            buttonLabel={null}
            handleDelete={() => handleDelete()}
            title="Eliminar monta"
            openModalItem={(props) => (
              <button
                className="btn btn-outline btn-sm shadow-md btn-error"
                {...props}
              >
                Eliminar <Icon name="delete" />
              </button>
            )}
          />
        </div>
      </Modal>
    </div>
  )
}

export default ModalBreedingOptions
