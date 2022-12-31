import { BreedingEventType } from '@firebase/Events/event.model'
import AnimalBreedingCard from 'components/BreedingsList/AnimalBreedingCard'
import {
  BreedingBatchFormattedType,
  calculatePossibleBirth,
  formatBreedingBatches,
  getPlusMinusDays
} from 'components/BreedingsList/breeding.helpers'
import IconBreedingStatus from 'components/IconBreedingStatus'
import { useState } from 'react'
import { myFormatDate } from 'utils/dates/myDateUtils'

const BreedingBatches = ({
  batches = []
}: {
  batches: Partial<BreedingEventType>[]
}) => {
  const breedings = formatBreedingBatches({ breedings: batches })
  return (
    <div>
      <div className="text-center">Total: {breedings.length}</div>

      {breedings.map((breeding) => (
        <div className="my-2" key={breeding.id}>
          <BreedingCard breeding={breeding} />
        </div>
      ))}
    </div>
  )
}

const BreedingCard = ({
  breeding
}: {
  breeding: Partial<BreedingBatchFormattedType>
}) => {
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
              {breeding.breedingMale?.earring}
            </span>{' '}
            <span>{breeding.breedingMale?.name}</span>
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

const BreedingCardBody = ({
  breeding
}: {
  breeding: BreedingBatchFormattedType
}) => {
  const { breedingBatch, breedingBirths, breedingAborts, breedingEmpty } =
    breeding
  const [list, setList] = useState<Partial<BreedingEventType['breedingBatch']>>(
    []
  )
  const possibleBirth = calculatePossibleBirth(breeding)
  const formatBatch = (batch: Partial<BreedingEventType['breedingBatch']>) =>
    batch.map((animal) => {
      return {
        possibleBirthStartIn: getPlusMinusDays(possibleBirth.startAt),
        possibleBirthFinishIn: getPlusMinusDays(possibleBirth.finishAt),
        ...animal,
        breeding: {
          ...breeding,
          possibleBirth
        }
      }
    })
  type ViewBatchesType = 'PENDING' | 'BIRTHS' | 'ALL' | ''
  const [view, setView] = useState<ViewBatchesType>('')
  console.log(breeding)
  const handleSetView = (newView: ViewBatchesType) => {
    if (newView === view) {
      setView('')
      setList([])
      return
    }
    setView(newView)
    if (newView == 'PENDING') {
      setList([...formatBatch(breedingBatch || [])])
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
        {list.map((animal, i) => (
          <AnimalBreedingCard key={i} animal={animal} />
        ))}
      </div>
    </main>
  )
}

export default BreedingBatches
