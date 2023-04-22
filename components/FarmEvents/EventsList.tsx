import EventFilters from '@comps/Filters/EventFilters'
import useSortByField from '@comps/hooks/useSortByField'
import HeaderTable from '@comps/MyTables/HeaderTable'
import { useState } from 'react'
import { FarmState } from 'store/slices/farmSlice'

import FarmEventCard from './FarmEvent/FarmEventCard'
import MyTable from '@comps/MyTable'
import {
  labelsOfFarmEventTypes,
  TypeOfFarmEvent
} from 'types/base/LABELS_TYPES/EventTypes'
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'
import useModal from '@comps/hooks/useModal'
import Modal from '@comps/modal'
import { FarmEvent } from 'types/base/FarmEvent.model'
import BirthEventDetails from './BirthEventDetails'
import BirthDetails from '@comps/BirthDetails'
import BreedingDetails from '@comps/BreedingDetails'

export const EventsList = ({ events }: { events: FarmState['events'] }) => {
  const modal = useModal()
  const [event, setEvent] = useState<FarmEvent | null>(null)
  console.log({ event })
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
      </Modal>
    </div>
  )
}

const a = () => (
  <div>
    {' '}
    {/* <DebouncedInput
        onChange={(value) => setFilterBy(`${value}`)}
        value={''}
        className="input input-bordered w-full placeholder:font-bold mb-2 "
        placeholder="Buscar ... "
      /> */}
    <EventFilters array={events} setArray={setFilteredEvents} />
    <div className="flex w-full items-center justify-around my-4 flex-col sm:flex-row gap-2 ">
      <div>Ordenar por:</div>
      <HeaderTable label={'Creado'} fieldName={'createdAt'} {...sortMethods} />
      <HeaderTable
        label={'Programado'}
        fieldName={'eventData.date'}
        {...sortMethods}
      />
      <HeaderTable
        label={'Tipo de evento'}
        fieldName={'type'}
        {...sortMethods}
      />
    </div>
    <div className="event-list overflow-auto shadow-inner">
      {[...arraySorted].map((event, i) => (
        <div key={`${event?.id}-${i}`} className="my-2">
          <FarmEventCard event={event} />
        </div>
      ))}
    </div>
  </div>
)
