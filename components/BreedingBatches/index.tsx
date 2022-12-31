import { BreedingEventType } from '@firebase/Events/event.model'
import AnimalBreedingCard, {
  AnimalBreedingCardType
} from 'components/BreedingsList/AnimalBreedingCard'
import {
  calculatePossibleBirth,
  formatBreedingBatches,
  getPlusMinusDays,
  PossiblesBirthDates
} from 'components/BreedingsList/breeding.helpers'
import IconBreedingStatus from 'components/IconBreedingStatus'
import { useState } from 'react'
import { myFormatDate } from 'utils/dates/myDateUtils'

export interface BreedingBatchesListType {
  batches: BreedingEventType[]
}
const BreedingBatchesList = ({ batches = [] }: BreedingBatchesListType) => {
  const breedings = formatBreedingBatches({ breedings: batches })
  return (
    <div>
      <div className="text-center">Total: {breedings.length}</div>

      {breedings.map((breeding) => (
        <div className="my-2" key={breeding?.id}>
          <BreedingCard breeding={breeding} />
        </div>
      ))}
    </div>
  )
}

export interface BreedingCard
  extends Pick<
    BreedingEventType,
    | 'id'
    | 'breedingAborts'
    | 'breedingBirths'
    | 'breedingAborts'
    | 'breedingBatch'
    | 'breedingEmpty'
    | 'startAt'
    | 'finishAt'
    | 'breedingMale'
  > {
  possibleBirthStartIn: number
  possibleBirthFinishIn: number
  possibleBirthDates: PossiblesBirthDates
}
const BreedingCard = ({ breeding }: { breeding: BreedingCard }) => {
  return (
    <div className="bg-base-300 rounded-md my-1">
      <header className="flex w-full justify-between p-2">
        <div>
          <div className="flex items-center ">
            <IconBreedingStatus
              startInDays={breeding?.possibleBirthStartIn as number}
              finishInDays={breeding?.possibleBirthFinishIn as number}
            />
          </div>
          <div className="font-lg">
            <span>Partos:</span>
            <span> del </span>
            <span className="font-bold">
              {myFormatDate(breeding.possibleBirthDates?.startAt, 'dd-MMM')}
            </span>
            <span> al </span>
            <span className="font-bold">
              {myFormatDate(breeding.possibleBirthDates?.finishAt, 'dd-MMM-yy')}
            </span>
          </div>
          <div className="font-sm">
            <span>Realizada: </span>
            <span> del </span>
            <span className="font-semibold">
              {myFormatDate(breeding.startAt, 'dd-MMM')}
            </span>
            <span> al </span>
            <span className="font-semibold">
              {myFormatDate(breeding.finishAt, 'dd-MMM-yy')}
            </span>
          </div>
        </div>
        <div className="">
          <span>
            Macho:{' '}
            <span className="font-bold text-xl">
              {breeding?.breedingMale?.earring}
            </span>{' '}
            <span>{breeding?.breedingMale?.name}</span>
          </span>
          <div>
            <span>Creado: </span>
            <span>12/12712</span>
          </div>
        </div>
      </header>
      <BreedingCardBody breeding={breeding} />
    </div>
  )
}

export interface BreedingCardBody extends BreedingCard {}
const BreedingCardBody = ({ breeding }: { breeding: BreedingCardBody }) => {
  const { breedingBatch, breedingBirths, breedingAborts, breedingEmpty } =
    breeding

  const [animals, setAnimals] = useState<AnimalBreedingCardType[]>([])
  const possibleBirth = calculatePossibleBirth({
    breedingFinishAt: breeding?.finishAt,
    breedingStartAt: breeding?.startAt
  })

  const formatBatch = (
    batch: AnimalBreedingCardType['batchData']
  ): AnimalBreedingCardType[] =>
    batch.map((animal: AnimalBreedingCardType['batchData']) => {
      return {
        possibleBirthStartIn: getPlusMinusDays(possibleBirth?.startAt),
        possibleBirthFinishIn: getPlusMinusDays(possibleBirth?.finishAt),
        ...animal,
        breeding: {
          ...breeding,
          possibleBirth
        }
      }
    })

  type ViewBatchesType = 'PENDING' | 'BIRTHS' | 'ALL' | ''
  const [view, setView] = useState<ViewBatchesType>('')
  const handleSetView = (newView: ViewBatchesType) => {
    if (newView === view) {
      setView('')
      setAnimals([])
      return
    }
    setView(newView)
    if (newView == 'PENDING') {
      setAnimals([...formatBatch(breedingBatch || [])])
    }
  }

  return (
    <main className="p-2">
      <div className="flex w-full justify-evenly">
        <span>
          <button onClick={() => handleSetView('PENDING')}>
            Espera {`(${breedingBatch?.length || 0})`}
          </button>
        </span>
      </div>
      <div>
        {animals.map((animal, i) => (
          <AnimalBreedingCard key={i} animal={animal} />
        ))}
      </div>
    </main>
  )
}

export default BreedingBatchesList
