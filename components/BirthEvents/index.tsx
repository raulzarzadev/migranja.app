import MyTable from '@comps/MyTable'
import TableDate from '@comps/MyTable/TableDate'
import RevertBirthForm from '@comps/forms/RevertBirthForm'
import useModal from '@comps/hooks/useModal'
import Modal from '@comps/modal'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import ModalBreedingDetails from '@comps/modal/ModalBreedingDetails'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmEvents } from 'store/slices/farmSlice'
import { AnimalFormattedWhitGenericEvenData } from 'types/base/AnimalType.model'
import { fromNow } from 'utils/dates/myDateUtils'

const BirthEvents = () => {
  const events = useSelector(selectFarmEvents)
  const births = events.filter((event) => event.type === 'BIRTH')
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }
  const [event, setEvent] = useState<AnimalFormattedWhitGenericEvenData>()
  const revertModal = useModal()
  const birthId = event?.id
  const breedingId = events.find(
    ({ eventData }) => eventData.breedingId === event?.eventData.breedingId
  )?.id

  const motherId = event?.eventData.parents.mother?.id
  const canRevert = birthId //&& breedingId && motherId
  return (
    <div className="w-full">
      <MyTable
        title="Lista de partos"
        headers={{
          date: {
            label: 'Fecha',
            format: (props) => <TableDate date={props} />
          },
          litter: {
            label: 'Camada',
            format: (props) => (
              <span>
                {props?.split(',').map((earring: string, i: number) => (
                  <ModalAnimalDetails
                    earring={earring}
                    size="normal"
                    key={earring + i}
                  />
                ))}
              </span>
            )
          },
          updatedAt: {
            label: 'Actualizado',
            format: (e) => fromNow(e, { addSuffix: true })
          },
          mom: {
            label: 'Madre',
            format: (p) => (
              <span>
                {p?.split(',').map((earring: string) => (
                  <ModalAnimalDetails
                    earring={earring}
                    size="normal"
                    key={earring}
                  />
                ))}
              </span>
            )
          },
          dad: {
            label: 'Padre',
            format: (p) => (
              <span>
                {p?.split(',').map((earring: string) => (
                  <ModalAnimalDetails
                    earring={earring}
                    size="normal"
                    key={earring}
                  />
                ))}
              </span>
            )
          },
          batch: {
            label: 'Lote'
          }
        }}
        data={births.map((e) => ({
          litter: e.eventData.calfs?.map((a) => a.earring).join(','),
          date: e.eventData.date,
          updatedAt: e.updatedAt,
          batch: e.eventData.breedingId,
          mom: e.eventData.parents.mother?.earring,
          dad: e.eventData.parents.father?.earring
        }))}
        showGlobalFilter
        onRowClick={(row) => {
          handleOpenModal()
          setEvent(births[row as number])
        }}
        defaultSort={[{ id: 'updatedAt', desc: true }]}
      />
      {openModal && (
        <Modal
          open={openModal}
          handleOpen={handleOpenModal}
          title="Detalles de parto"
        >
          <div>
            <span className="font-bold">Fechas:</span>
            <div className="flex w-full justify-evenly text-center my-2">
              <span>
                Fecha: <TableDate date={event?.eventData.date as number} />
              </span>
              <span>
                Creado: <TableDate date={event?.createdAt as number} />
              </span>
              <span>
                Actualizado: <TableDate date={event?.updatedAt as number} />
              </span>
            </div>
            <div>
              <span className="font-bold">Lote/Monta:</span>
              <div className="text-center my-2">
                {event?.eventData.breedingId ||
                  (event?.eventData.batch && (
                    <ModalBreedingDetails
                      breedingBatchId={
                        event?.eventData.breedingId ||
                        (event?.eventData.batch as string)
                      }
                    />
                  ))}
              </div>
            </div>
            <div>
              <span className="font-bold">Camada:</span>
              <div className="flex w-full justify-evenly my-2">
                {event?.eventData.calfs?.map((calf) => (
                  <div key={calf.id}>
                    <ModalAnimalDetails earring={calf.earring} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold">Padres:</span>
              <div className="flex justify-evenly w-full my-2">
                <span>
                  Madre:{' '}
                  <ModalAnimalDetails
                    earring={event?.eventData.parents.mother?.earring}
                  />
                </span>
                <span>
                  Padre:
                  <span className="">
                    <ModalAnimalDetails
                      earring={event?.eventData.parents.father?.earring}
                    />
                    <span className="text-sm">
                      {event?.eventData.parents.father?.name}
                    </span>
                  </span>
                </span>
              </div>
            </div>
            {canRevert && (
              <div className="text-center mt-4">
                <button
                  onClick={() => {
                    revertModal.handleOpen()
                  }}
                  className="btn btn-error btn-outline"
                >
                  Revertir parto
                </button>
                <Modal
                  open={revertModal.open}
                  handleOpen={revertModal.handleOpen}
                  title="Revertir parto"
                >
                  <RevertBirthForm
                    birthEventId={birthId}
                    breedingId={breedingId}
                    motherId={motherId}
                  />
                </Modal>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* <EventsList events={births} /> */}
    </div>
  )
}

export default BirthEvents
