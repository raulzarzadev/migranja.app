import { EventType } from '@firebase/Events/event.model'
import { ReactNode } from 'react'
import { FarmStateAnimalEvent } from 'store/slices/farmSlice'
import { fromNow } from 'utils/dates/myDateUtils'
import BirthEventDetails from '../BirthEventDetails'
import EventModal from '../EventModal'
import {
  AbortDetailsEvent,
  BirthDetailsEvent,
  BreedingDetailsEvent,
  EmptyDetailsEvent,
  GenericEventType
} from './FarmEvent.model'

export const FarmEvent = ({ event }: { event: FarmStateAnimalEvent }) => {
  interface FarmEventOptions {
    label: string
    Component: ReactNode
  }
  const DETAILS_OPTIONS: Record<EventType['type'] | 'NULL', FarmEventOptions> =
    {
      BREEDING: {
        label: 'Monta',
        Component: <BreedingEventRow event={event} />
      },
      BIRTH: {
        label: 'Parto',
        Component: <BirthEventRow event={event} />
      },
      ABORT: {
        label: 'Aborto',
        Component: <AbortEventRow event={event} />
      },
      EMPTY: {
        label: 'Vacio',
        Component: <EmptyEventRow event={event} />
      },
      REMOVE: {
        label: 'Eliminado',
        Component: <BirthEventDetails event={event} />
      },
      NULL: {
        label: 'Generico',
        Component: <div>Generico</div>
      }
    }
  return (
    <div>
      <HeaderEventCard
        event={event}
        options={{ label: DETAILS_OPTIONS[event?.type].label }}
      />
      <div className="p-2 ">
        {DETAILS_OPTIONS[event?.type ?? 'NULL'].Component}
      </div>
    </div>
  )
}

const HeaderEventCard = ({
  event,
  options
}: {
  event: FarmStateAnimalEvent
  options: { label: string }
}) => {
  return (
    <div role={'farm-event'} className={`bg-base-300 w-full rounded-md `}>
      <div className="flex justify-between items-center px-2 pt-1 w-full ">
        <span>{options.label}</span>
        <span>
          <EventModal event={event} />
        </span>
      </div>
      <header className="p-2 w-full flex justify-between items-center bg-base-200">
        <div className="flex flex-col ">
          <span className="italic text-sm">
            {event.createdAt && fromNow(event.createdAt, { addSuffix: true })}
          </span>
        </div>
      </header>
    </div>
  )
}
const BreedingEventRow = ({
  event
}: {
  event: GenericEventType<BreedingDetailsEvent>
}) => {
  return <div>{event.type}</div>
}

const BirthEventRow = ({ event }: { event: FarmStateAnimalEvent }) => {
  return <div>{event.type}</div>
}
const AbortEventRow = ({ event }: { event: FarmStateAnimalEvent }) => {
  return <div>{event.type}</div>
}

const EmptyEventRow = ({ event }: { event: FarmStateAnimalEvent }) => {
  return <div>{event.type}</div>
}

export default FarmEvent
