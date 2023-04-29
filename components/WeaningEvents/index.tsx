import _ from 'lodash'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmEvents } from 'store/slices/farmSlice'
import MyTable from '@comps/MyTable'
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'
import {
  TypeOfFarmEvent,
  labelsOfFarmEventTypes
} from 'types/base/LABELS_TYPES/EventTypes'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import TableDate from '@comps/MyTable/TableDate'
import Modal from '@comps/modal'
import { AnimalFormattedWhitGenericEvenData } from 'types/base/AnimalType.model'
import WeaningDetails from '@comps/WeaningDetails'
import WeaningIconStatus from '@comps/WeaningIconStatus'

const WeaningEvents = () => {
  const events = useSelector(selectFarmEvents)
  const weanings = events.filter((event) => event.type === 'WEANING')
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }
  const [selectedRow, setSelectedRow] = useState<number | string | undefined>()

  const eventSelected: AnimalFormattedWhitGenericEvenData =
    weanings?.[selectedRow as number]

  const data = weanings.map((weaning) => ({
    date: weaning.eventData.date,
    earring: weaning.eventData.earring,
    status: weaning.eventData.status
  }))

  return (
    <div className="w-full p-2 bg-base-300 rounded-md shadow-md">
      <div className="flex w-full justify-center">
        <MyTable
          defaultSort={[{ id: 'date', desc: true }]}
          showGlobalFilter
          title="Destetes programados"
          headers={{
            date: {
              label: 'Fecha',
              format: (props) => <TableDate date={props} />
            },
            earring: {
              label: 'Arete',
              format: (props) => (
                <ModalAnimalDetails earring={props} size="normal" />
              )
            },
            status: {
              label: 'Status',
              format: (props) => (
                <span>
                  {labelsOfFarmEventTypes?.[props as TypeOfFarmEvent]}
                  <span className="mx-1">
                    <WeaningIconStatus status={props} />
                  </span>
                </span>
              )
            }
          }}
          data={data}
          filters={{
            Pendientes: {
              field: 'status',
              symbol: '==',
              value: 'PENDING'
            },
            Completados: {
              field: 'status',
              symbol: '==',
              value: 'DONE'
            }
            // '-2meses': {
            //   field: 'date',
            //   symbol: '>=',
            //   value: subMonths(new Date(), 2).getTime()
            // },
            // '+2meses': {
            //   field: 'date',
            //   symbol: '>=',
            //   value: addMonths(new Date(), 2).getTime()
            // }
          }}
          onRowClick={(row) => {
            setSelectedRow?.(row)
            handleOpenModal()
          }}
        />
        {openModal && (
          <Modal
            open={openModal}
            handleOpen={handleOpenModal}
            title="Detalle de destete"
          >
            <WeaningDetails weaningId={eventSelected.id} />
            {/* <div className="flex w-full justify-center">
              <div className="flex w-full justify-evenly">
                <ModalDelete
                  title="Eliminar evento"
                  buttonLabel={'Eliminar'}
                  handleDelete={() => {
                    console.log('delete')
                  }}
                />
                {eventSelected.eventData.status === 'PENDING' && (
                  <ModalEditWeaning
                    eventId={eventSelected?.id}
                    animalEarring={eventSelected?.eventData?.earring}
                  />
                )}
                {eventSelected.eventData.status === 'CANCELLED' && (
                  <button className="btn btn-outline btn-error">
                    Cancelado
                  </button>
                )}
                {eventSelected.eventData.status === 'DONE' && (
                  <button className="btn btn-success">Completado</button>
                )}
              </div>
            </div> */}
          </Modal>
        )}
      </div>
    </div>
  )
}

export default WeaningEvents
