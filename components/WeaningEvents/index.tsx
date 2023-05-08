import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmEvents } from 'store/slices/farmSlice'
import MyTable from '@comps/MyTable'
import { StatusOfFarmEvent } from 'types/base/LABELS_TYPES/EventTypes'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import TableDate from '@comps/MyTable/TableDate'
import Modal from '@comps/modal'
import WeaningDetails from '@comps/WeaningDetails'
import WeaningIconStatus from '@comps/WeaningIconStatus'
import WeaningNumbers from './WeaningNumbers'
import useAnimal from '@comps/hooks/useAnimal'
import { AnimalFormattedWhitGenericEvenData } from 'types/base/AnimalType.model'
import { WEANING_STATUS_LABELS } from '@comps/FarmEvents/FarmEvent/WeaningEventCard'

const WeaningEvents = () => {
  const events = useSelector(selectFarmEvents)
  const weanings = events.filter((event) => event.type === 'WEANING')
  const [openModal, setOpenModal] = useState(false)
  const { findParents } = useAnimal()
  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }
  const [selectedRow, setSelectedRow] = useState<number | string | undefined>()
  const determinateStatus = (
    status: AnimalFormattedWhitGenericEvenData['status'],
    date: number
  ): AnimalFormattedWhitGenericEvenData['status'] => {
    if (status === 'CANCELLED') return 'CANCELLED'
    if (status === 'DONE') return 'DONE'
    if (date < new Date().getTime()) return 'PAST'
    return status
  }
  const data = weanings
    .map((weaning) => ({
      id: weaning.id,
      date: weaning.eventData.date,
      earring: weaning.eventData.earring,
      mother: findParents({ animalEarring: weaning.eventData.earring })?.mother
        ?.earring,
      status: determinateStatus(
        weaning.eventData.status,
        weaning.eventData.date as number
      )
    }))
    .filter((event) => event.status === 'PENDING' || event.status === 'PAST')

  const eventSelected: any = data?.[selectedRow as number]

  return (
    <div className="w-full p-2 bg-base-300 rounded-md shadow-md">
      <div className="">
        <WeaningNumbers
          weaning={weanings.filter((e) => e.eventData.status === 'PENDING')}
        />
      </div>
      <div className="flex w-full justify-center">
        <MyTable
          defaultSort={[{ id: 'date', desc: true }]}
          showGlobalFilter
          title="Destetes programados"
          hiddenCols={['id']}
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
            mother: {
              label: 'Madre',
              format(props) {
                return <ModalAnimalDetails earring={props} size="normal" />
              }
            },
            status: {
              label: 'Status',
              format: (props) => (
                <span>
                  {WEANING_STATUS_LABELS?.[props as StatusOfFarmEvent]}
                  <span className="mx-1">
                    <WeaningIconStatus status={props} />
                  </span>
                </span>
              )
            }
          }}
          data={data}
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
          </Modal>
        )}
      </div>
    </div>
  )
}

export default WeaningEvents
