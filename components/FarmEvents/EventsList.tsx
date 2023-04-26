import { useState } from 'react'
import { FarmState } from 'store/slices/farmSlice'
import MyTable from '@comps/MyTable'
import {
  labelsOfFarmEventTypes,
  TypeOfFarmEvent
} from 'types/base/LABELS_TYPES/EventTypes'
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'
import useModal from '@comps/hooks/useModal'
import Modal from '@comps/modal'
import { FarmEvent } from 'types/base/FarmEvent.model'
import BirthDetails from '@comps/BirthDetails'
import BreedingDetails from '@comps/BreedingDetails'
import WeaningDetails from '@comps/WeaningDetails'

export const EventsList = ({ events }: { events: FarmState['events'] }) => {
  const modal = useModal()
  const [event, setEvent] = useState<FarmEvent | null>(null)
  return (
    <div role="events-list">
      <MyTable
        title="Todos los eventos"
        headers={{
          type: {
            label: 'Tipo',
            format: (props) => labelsOfFarmEventTypes[props as TypeOfFarmEvent]
          },

          updatedAt: {
            label: 'Actualizado',
            format(props) {
              return fromNow(props, { addSuffix: true })
            }
          },
          date: {
            label: 'Fecha',
            format(props) {
              return myFormatDate(props, 'dd/MM/yy')
            }
          }
        }}
        data={events.map((e) => ({
          type: e.type,
          //createAt: e.createdAt,
          updatedAt: e.updatedAt,
          date: e.eventData.date
        }))}
        filters={{
          Destetes: { field: 'type', symbol: '>', value: 'WEANING' },
          Partos: { field: 'type', symbol: '>', value: 'BIRTH' },
          Bajas: { field: 'type', symbol: '>', value: 'DROP_OUT' },
          Altas: { field: 'type', symbol: '>', value: 'DROP_IN' }
        }}
        onRowClick={(e) => {
          setEvent(events?.[e as number] || null)
          modal.handleOpen()
        }}
      />
      <Modal
        {...modal}
        title={`Detalles del evento:  ${
          labelsOfFarmEventTypes[event?.type as TypeOfFarmEvent]
        }`}
      >
        {event?.type === 'BIRTH' && <BirthDetails birthId={event.id} />}
        {event?.type === 'BREEDING' && (
          <BreedingDetails breedingId={event?.id} />
        )}
        {event?.type === 'WEANING' && <WeaningDetails weaningId={event?.id} />}
      </Modal>
    </div>
  )
}
