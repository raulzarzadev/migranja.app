import LinkFarmAnimal from '@comps/Buttons&Links/LinkFarmAnimal'
import GeneticTree from 'components/GeneticTree'
import { ReactNode } from 'react'
import { AnimalFormattedWhitGenericEvenData } from 'types/base/AnimalType.model'
import { FarmEventDropOut } from 'types/base/FarmEventDropOut.model'
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'
import BirthEventDetails from '../BirthEventDetails'
import EventModal from '../EventModal'
import DropOutEventRow from './DropOutEventRow'

export const FarmEventCard = ({
  event
}: {
  event: AnimalFormattedWhitGenericEvenData
}) => {
  interface FarmEventOptions {
    label: string
    Component: ReactNode
  }
  const DETAILS_OPTIONS: Record<
    | AnimalFormattedWhitGenericEvenData['type']
    | 'NULL'
    | FarmEventDropOut['type'],
    FarmEventOptions
  > = {
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
    },
    DROP_OUT: {
      label: 'Baja ',
      Component: (
        <DropOutEventRow event={event as unknown as FarmEventDropOut} />
      )
    },
    DROP_IN: {
      label: 'Alta ',
      Component: (
        <DropOutEventRow event={event as unknown as FarmEventDropOut} />
      )
    }
  }
  return (
    <div
      className="bg-base-300 rounded-md pb-2 shadow-md collapse"
      tabIndex={0}
    >
      <HeaderEventCard
        event={event}
        options={{ label: DETAILS_OPTIONS[event?.type].label }}
      />
      <div className="bg-base-200 ">
        <div className="p-2  ">
          {DETAILS_OPTIONS[event?.type ?? 'NULL'].Component}
        </div>
      </div>
    </div>
  )
}

const HeaderEventCard = ({
  event,
  options
}: {
  event: AnimalFormattedWhitGenericEvenData
  options: { label: string }
}) => {
  const eventDate = event?.eventData?.date
  return (
    <div role={'farm-event'} className={`bg-base-300 w-full rounded-md `}>
      <div className="flex justify-between items-center px-2 pt-1 w-full ">
        <span>{options.label}</span>
        <span>{eventDate && myFormatDate(eventDate, 'dd MMM yy')}</span>
        <span>
          <EventModal event={event} />
        </span>
      </div>
      <header className="p-2 w-full flex justify-between items-center ">
        <div className="flex flex-col ">
          <span className="italic text-xs">
            Actualizado:{' '}
            {event.updatedAt && fromNow(event.updatedAt, { addSuffix: true })}
          </span>
        </div>
      </header>
    </div>
  )
}
const BreedingEventRow = ({
  event
}: {
  event: AnimalFormattedWhitGenericEvenData
}) => {
  const eventData = event.eventData
  return (
    <div>
      <div className="text-center">
        <span>Lote: {eventData?.breedingId}</span>
      </div>
      <GeneticTree
        elements={{
          father: {
            id: eventData?.breedingMale?.id as string,
            label: eventData?.breedingMale?.earring as string
          },
          mothers: eventData?.breedingBatch
        }}
      />
    </div>
  )
}
const GenericBreedingInfo = ({
  event
}: {
  event: AnimalFormattedWhitGenericEvenData
}) => {
  const eventData = event?.eventData
  const father = eventData?.parents?.father
  const mother = eventData?.parents?.mother

  return (
    <div>
      <div className="text-center">
        <span>Lote: {eventData?.breedingId}</span>
      </div>
      <GeneticTree
        elements={{
          father: {
            id: father?.id as string,
            label: father?.earring as string
          },
          mother: {
            id: mother?.id as string,
            label: mother?.earring as string
          }
        }}
      />
    </div>
  )
}
const BirthEventRow = ({
  event
}: {
  event: AnimalFormattedWhitGenericEvenData
}) => {
  const eventData = event.eventData

  return (
    <div>
      <GenericBreedingInfo event={event} />

      <div className="flex justify-evenly">
        <div className="flex flex-col">
          <span>Camadada: {eventData?.calfs?.length}</span>
        </div>
        <div className="flex flex-col">
          <div>Aretes:</div>
          {eventData.calfs?.map((calf) => (
            <div key={calf.earring}>
              <div>
                {calf.earring}{' '}
                <LinkFarmAnimal
                  farmId={event.farm.id}
                  animalEarringOrId={calf?.earring || ''}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
const AbortEventRow = ({
  event
}: {
  event: AnimalFormattedWhitGenericEvenData
}) => {
  return (
    <div>
      <GenericBreedingInfo event={event} />
    </div>
  )
}

const EmptyEventRow = ({
  event
}: {
  event: AnimalFormattedWhitGenericEvenData
}) => {
  return (
    <div>
      <GenericBreedingInfo event={event} />
    </div>
  )
}

export default FarmEventCard
