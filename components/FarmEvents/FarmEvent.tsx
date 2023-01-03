import { BirthDataType } from '@firebase/Events/event.model'
import { fromNow } from 'utils/dates/myDateUtils'
import BirthEventDetails from './BirthEventDetails'
import BreedingEventDetails from './BreedingEventDetails'
import EventModal from './EventModal'

export interface FarmEventType {
  type: 'BIRTH' | 'ABORT' | 'BREEDING' | 'EMPTY'
  id: string
  birthData?: BirthDataType
  // parents: ParentsType
  updatedAt: number
  createdAt: number
}

export const FarmEvent = ({ event }: { event: FarmEventType }) => {
  return (
    <>
      {event.type === 'BREEDING' && <BreedingEventDetails event={event} />}
      {event.type === 'BIRTH' && <BirthEventCard event={event} />}
      {event.type === 'ABORT' && <AbortEventCard event={event} />}
      {event.type === 'EMPTY' && <EmptyEventCard event={event} />}
    </>
  )
}

const EmptyEventCard = ({ event }: { event: FarmEventType }) => {
  return (
    <div role={'farm-event'} className={`bg-base-300 w-full rounded-md `}>
      <div className="flex justify-between items-center px-2 pt-1 w-full ">
        <span></span>
        <span>Vacia</span>
        <span>
          <EventModal event={event} />
        </span>
      </div>
      <header className="p-2 w-full flex justify-between items-center bg-base-200">
        <div className="flex flex-col ">
          <span>{event.type}</span>
          <span className="italic text-sm">
            {event.createdAt && fromNow(event.createdAt, { addSuffix: true })}
          </span>
        </div>
      </header>
      <div className="p-2 ">
        <BirthEventDetails event={event} />
      </div>
    </div>
  )
}
const AbortEventCard = ({ event }: { event: FarmEventType }) => {
  return (
    <div role={'farm-event'} className={`bg-base-300 w-full rounded-md `}>
      <div className="flex justify-between items-center px-2 pt-1 w-full ">
        <span></span>
        <span>Aborto</span>
        <span>
          <EventModal event={event} />
        </span>
      </div>
      <header className="p-2 w-full flex justify-between items-center bg-base-200">
        <div className="flex flex-col ">
          <span>{event.type}</span>
          <span className="italic text-sm">
            {event.createdAt && fromNow(event.createdAt, { addSuffix: true })}
          </span>
        </div>
      </header>
      <div className="p-2 ">
        <BirthEventDetails event={event} />
      </div>
    </div>
  )
}
const BirthEventCard = ({ event }: { event: FarmEventType }) => {
  return (
    <div role={'farm-event'} className={`bg-base-300 w-full rounded-md `}>
      <div className="flex justify-between items-center px-2 pt-1 w-full ">
        <span></span>
        <span>Parto</span>
        <span>
          <EventModal event={event} />
        </span>
      </div>
      <header className="p-2 w-full flex justify-between items-center bg-base-200">
        <div className="flex flex-col ">
          <span>{event.type}</span>
          <span className="italic text-sm">
            {event.createdAt && fromNow(event.createdAt, { addSuffix: true })}
          </span>
        </div>
      </header>
      <div className="p-2 ">
        <BirthEventDetails event={event} />
      </div>
    </div>
  )
}
export default FarmEvent
