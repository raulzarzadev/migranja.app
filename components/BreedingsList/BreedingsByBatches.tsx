import { MalesTable } from '@comps/MalesTable'
import { listenEvent } from '@firebase/Events/main'
import { BreedingFormatted } from 'components/BreedingsList/breeding.helpers'
import IconBreedingStatus from 'components/IconBreedingStatus'
import { useEffect, useState } from 'react'
import {
  AnimalBreedingEventCard,
  BreedingEventCardDetails
} from 'types/base/FarmEvent.model'
import { AnimalBreedingStatus } from 'types/base/LABELS_TYPES/EventTypes'
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'
import AnimalBreedingCardSmall from './AnimalBreedingCardSmall'
import ModalBreedingOptions from './ModalBreedingOptions'
import IconStatus from '@comps/IconStatus'

export interface BreedingBatchesListType {
  breedings: BreedingEventCardDetails[]
}
const BreedingsByBatches = ({ breedings = [] }: BreedingBatchesListType) => {
  const sortByUpdated = (a: any, b: any) => {
    if (a?.updatedAt < b?.updatedAt) return 1
    if (a?.updatedAt > b?.updatedAt) return -1
    return 0
  }
  const sortByPossibleBirth = (a: any, b: any) => {
    if (
      a?.eventData.breedingDates.birthFinishInDays <
      b?.eventData.breedingDates.birthFinishInDays
    )
      return -1
    if (
      a?.eventData.breedingDates.birthFinishInDays >
      b?.eventData.breedingDates.birthFinishInDays
    )
      return 1
    return 0
  }
  return (
    <div>
      <div className="text-center">Total: {breedings.length}</div>
      {breedings.sort(sortByPossibleBirth).map((breeding) => (
        <div className="my-2 " key={breeding?.id}>
          <BreedingCard breeding={breeding} />
        </div>
      ))}
    </div>
  )
}

export const BreedingCard = ({
  hiddenConfig,
  hiddenBirths,
  breeding
}: {
  hiddenConfig?: boolean
  hiddenBirths?: boolean
  breeding: BreedingEventCardDetails
}) => {
  const breedingMale = breeding?.eventData?.breedingMale
  const breedingDates = breeding.eventData?.breedingDates
  const otherMales = breeding.eventData?.otherMales || []
  const atLeastOnePending = breeding.eventData.breedingBatch
    .map((animal) => animal.status)
    .some((status) => status === 'PENDING')
  return (
    <div className="bg-base-300 rounded-md my-1 mt-4">
      <header>
        {/* BADGES */}
        <div className="relative">
          <span className="absolute left-0 -top-2 ">
            {!atLeastOnePending ? (
              <IconStatus status="success" />
            ) : (
              <IconBreedingStatus
                startInDays={breedingDates?.birthStartInDays as number}
                finishInDays={breedingDates?.birthFinishInDays as number}
              />
            )}
          </span>
          <span className="absolute right-0 -top-2">
            {!hiddenConfig && <ModalBreedingOptions breeding={breeding} />}
          </span>
        </div>
        {/* Breeding info */}
        <div className="grid text-center text-xs">
          <span className="font-bold">
            <span className="font-normal">Monta:</span>{' '}
            {breeding.eventData?.breedingId}
          </span>
          <span>
            Creada:{' '}
            <span className="font-bold">
              {fromNow(breeding.createdAt, { addSuffix: true })}
            </span>
          </span>
        </div>
      </header>
      <MalesTable
        males={[
          {
            earring: breedingMale?.earring || '',
            name: breedingMale?.name || '',
            startAt: breedingDates?.breedingStartAt || '',
            finishAt: breeding.eventData.finishAt || ''
          },
          ...otherMales
        ]}
      />
      <BreedingDatesInfo
        startAt={breedingDates?.birthStartAt as number}
        finishAt={breedingDates?.birthFinishAt as number}
      />

      <BreedingCardBody breeding={breeding} hiddenBirths={hiddenBirths} />
    </div>
  )
}

const BreedingDatesInfo = ({
  startAt,
  finishAt
}: {
  startAt?: number
  finishAt?: number
}) => {
  const start = startAt && myFormatDate(startAt, 'dd-MMM')
  const finish = finishAt && myFormatDate(finishAt, 'dd-MMM')
  return (
    <div className="text-center ">
      Partos esperados: <span className="font-bold">{start}</span>
      <span className="mx-2">al</span>
      <span className="font-bold">{finish}</span>
    </div>
  )
}

export interface BreedingCardBody extends BreedingFormatted {}

const BreedingCardBody = ({
  breeding,
  hiddenBirths
}: {
  breeding: BreedingEventCardDetails
  hiddenBirths?: boolean
}) => {
  type ViewBatchesType = AnimalBreedingStatus | '' | 'ALL'

  const sortByEarring = (a: any, b: any) => {
    if (a.earring > b.earring) return 1
    if (a.earring < b.earring) return -1
    return 0
  }
  const [view, setView] = useState<ViewBatchesType>('')
  const [_breeding, _setBreeding] = useState(breeding)
  useEffect(() => {
    listenEvent(breeding.id, (res: BreedingEventCardDetails) =>
      _setBreeding(res)
    )
  }, [breeding.id])

  const animals: AnimalBreedingEventCard[] = _breeding?.eventData?.breedingBatch
    ?.map((animal) => {
      return {
        ...animal,
        eventData: {
          ...breeding.eventData,
          id: breeding.id,
          parents: {
            father: {
              id: breeding.eventData.breedingMale?.id,
              earring: breeding.eventData.breedingMale?.earring,
              name: breeding.eventData.breedingMale?.name
            },
            mother: {
              id: animal.id,
              earring: animal.earring,
              name: animal.name
            }
          }
        }
      }
    })
    .sort(sortByEarring)

  const pendingAnimals = animals?.filter(({ status }) => status === 'PENDING')
  const abortAnimals = animals?.filter(({ status }) => status === 'ABORT')
  const birthAnimals = animals?.filter(({ status }) => status === 'BIRTH')
  const emptyAnimals = animals?.filter(({ status }) => status === 'EMPTY')

  const handleSetView = (newView: ViewBatchesType) => {
    if (newView === view) {
      setView('')
    } else {
      setView(newView)
    }
  }

  return (
    <main className="p-2">
      <div className="flex w-full justify-evenly">
        <span>
          <button
            onClick={() => handleSetView('ALL')}
            className={` rounded-t-md p-2 ${view == 'ALL' && 'bg-base-100'}`}
          >
            Todos {`(${animals?.length || 0})`}
          </button>
        </span>
        <span>
          <button
            onClick={() => handleSetView('PENDING')}
            className={` rounded-t-md p-2 ${
              view == 'PENDING' && 'bg-base-100'
            }`}
          >
            Espera {`(${pendingAnimals?.length || 0})`}
          </button>
        </span>
        <span>
          <button
            onClick={() => handleSetView('ABORT')}
            className={` rounded-t-md p-2  ${view == 'ABORT' && 'bg-base-100'}`}
          >
            Abortos {`(${abortAnimals?.length || 0})`}
          </button>
        </span>
        <span>
          <button
            onClick={() => handleSetView('BIRTH')}
            className={` rounded-t-md p-2 ${view == 'BIRTH' && 'bg-base-100'}`}
          >
            Partos {`(${birthAnimals?.length || 0})`}
          </button>
        </span>
        <span>
          <button
            onClick={() => handleSetView('EMPTY')}
            className={` rounded-t-md p-2 ${view == 'EMPTY' && 'bg-base-100'}`}
          >
            Vacios {`(${emptyAnimals?.length || 0})`}
          </button>
        </span>
      </div>
      <div className="bg-base-100 p-1   pt-1 rounded-md">
        <div className="">
          {view === 'ALL' &&
            animals?.map((animal, i) => (
              <AnimalBreedingCardSmall
                key={i}
                animal={animal}
                hiddenEvents={hiddenBirths}
                breedingId={breeding.id}
              />
            ))}
          {view === 'PENDING' &&
            pendingAnimals?.map((animal, i) => (
              <AnimalBreedingCardSmall
                key={i}
                animal={animal}
                hiddenEvents={hiddenBirths}
                breedingId={breeding.id}
              />
            ))}
          {view === 'ABORT' &&
            abortAnimals?.map((animal, i) => (
              <AnimalBreedingCardSmall
                key={i}
                animal={animal}
                hiddenEvents={hiddenBirths}
                breedingId={breeding.id}
              />
            ))}
          {view === 'BIRTH' &&
            birthAnimals?.map((animal, i) => (
              <AnimalBreedingCardSmall
                key={i}
                animal={animal}
                hiddenEvents={hiddenBirths}
                breedingId={breeding.id}
              />
            ))}
          {view === 'EMPTY' &&
            emptyAnimals?.map((animal, i) => (
              <AnimalBreedingCardSmall
                key={i}
                animal={animal}
                hiddenEvents={hiddenBirths}
                breedingId={breeding.id}
              />
            ))}
        </div>
      </div>
    </main>
  )
}

export default BreedingsByBatches
