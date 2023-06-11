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
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import { AnimalType } from 'types/base/AnimalType.model'

export const EventsList = ({
  events,
  title = 'Eventos'
}: {
  events: FarmState['events']
  title?: string
}) => {
  const modal = useModal()
  const [event, setEvent] = useState<FarmEvent | null>(null)
  return (
    <div role="events-list">
      <MyTable
        title={title}
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
          },
          earrings: {
            label: 'Animales',
            format(props) {
              return (
                <div className="flex flex-wrap">
                  {props?.().map((a: AnimalType, i: number) => (
                    <div className="flex flex-wrap" key={i}>
                      <ModalAnimalDetails size="sm" earring={a.earring} />
                    </div>
                  ))}
                </div>
              )
            }
          }
        }}
        data={events.map((e) => ({
          type: e.type,
          //createAt: e.createdAt,
          updatedAt: e.updatedAt,
          date: e.eventData.date,
          earrings: () => {
            let earrings = []
            if (e.eventData.earring) {
              earrings.push({ earring: e.eventData.earring })
            }
            if (e.type === 'BIRTH') {
              earrings = [...earrings, ...(e?.eventData?.calfs || [])]
            }
            if (e.type === 'BREEDING') {
              earrings = [...earrings, ...(e?.eventData?.breedingBatch || [])]
            }
            if (e.type === 'DROP_OUT') {
              earrings = [...earrings, ...(e?.eventData?.animals || [])]
            }
            if (e.type === 'DROP_IN') {
              earrings = [...earrings, ...(e?.eventData?.animals || [])]
            }
            if (e.type === 'SELL') {
              earrings = [...earrings, ...(e?.eventData?.earrings || [])]
            }
            // if (e.type === 'EMPTY') {
            //   console.log({ e })
            //   earrings = [...earrings, ...(e?.eventData?.earrings || [])]
            // }
            return earrings
          }
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
        defaultSort={[]}
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
