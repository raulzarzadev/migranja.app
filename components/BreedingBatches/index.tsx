import { BreedingEventType } from '@firebase/Events/event.model'
import { deleteEvent } from '@firebase/Events/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import AnimalBreedingCard, {
  AnimalBreedingCardType
} from 'components/BreedingsList/AnimalBreedingCard'
import {
  calculatePossibleBirth,
  formatBreedingBatches,
  getPlusMinusDays,
  PossiblesBirthDates
} from 'components/BreedingsList/breeding.helpers'
import Icon from 'components/Icon'
import IconBreedingStatus from 'components/IconBreedingStatus'
import ModalDelete from 'components/modal/ModalDelete'
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
  animals?: Partial<AnimalBreedingCardType>[]
  possibleBirthStartIn: number
  possibleBirthFinishIn: number
  possibleBirthDates: PossiblesBirthDates
}
const BreedingCard = ({ breeding }: { breeding: BreedingCard }) => {
  const handleDelete = async () => {
    const res = await deleteEvent(breeding.id)
    return console.log(res)
  }

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
        <div className="relative">
          <span className="absolute -top-6 -right-2">
            <ModalDelete
              buttonLabel={null}
              handleDelete={() => handleDelete()}
              title="Eliminar monta"
              openModalItem={(props) => (
                <button className="btn btn-circle btn-sm shadow-md" {...props}>
                  <Icon name="delete" />
                </button>
              )}
            />
          </span>
          <div>
            <span>
              Macho:{' '}
              <span className="font-bold text-xl">
                {breeding?.breedingMale?.earring}
              </span>{' '}
              <span>{breeding?.breedingMale?.name}</span>
            </span>
          </div>
          <div>
            <span>Creado: </span>
            <span>hace 10 dias</span>
          </div>
        </div>
      </header>
      <BreedingCardBody breeding={breeding} />
    </div>
  )
}

export interface BreedingCardBody extends BreedingCard {}
const BreedingCardBody = ({ breeding }: { breeding: BreedingCardBody }) => {
  const [animals, setAnimals] = useState<AnimalBreedingCardType[]>([])
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
      setAnimals([...(breeding?.animals || [])])
    }
  }

  return (
    <main className="p-2">
      <div className="flex w-full justify-evenly">
        <span>
          <button onClick={() => handleSetView('PENDING')}>
            Espera {`(${breeding?.animals?.length || 0})`}
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
