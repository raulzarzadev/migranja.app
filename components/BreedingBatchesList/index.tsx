import { deleteEvent } from '@firebase/Events/main'
import AnimalBreedingCard, {
  AnimalBreedingCardType
} from 'components/BreedingsList/AnimalBreedingCard'
import {
  AnimalFormatted,
  BreedingFormatted
} from 'components/BreedingsList/breeding.helpers'
import Icon from 'components/Icon'
import IconBreedingStatus from 'components/IconBreedingStatus'
import ModalDelete from 'components/modal/ModalDelete'
import { useState } from 'react'
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'

export interface BreedingBatchesListType {
  breedings: BreedingFormatted[]
}
const BreedingBatchesList = ({ breedings = [] }: BreedingBatchesListType) => {
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

const BreedingCard = ({ breeding }: { breeding: BreedingFormatted }) => {
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
              startInDays={breeding?.birthStartInDays as number}
              finishInDays={breeding?.birthFinishInDays as number}
            />
          </div>
          <div className="font-lg">
            <span>Partos:</span>
            <span> del </span>
            <span className="font-bold">
              {myFormatDate(breeding.birthStartAt, 'dd-MMM')}
            </span>
            <span> al </span>
            <span className="font-bold">
              {myFormatDate(breeding.birthFinishAt, 'dd-MMM-yy')}
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
        <span>Lote:{breeding?.batch}</span>
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
          <div className="text-xs">
            <span>Creado: </span>
            <span>{fromNow(breeding.createdAt, { addSuffix: true })}</span>
          </div>
        </div>
      </header>
      <BreedingCardBody breeding={breeding} />
    </div>
  )
}

export interface BreedingCardBody extends BreedingFormatted {}
const BreedingCardBody = ({ breeding }: { breeding: BreedingCardBody }) => {
  const [animals, setAnimals] = useState<AnimalFormatted[]>([])
  type ViewBatchesType = 'PENDING' | 'BIRTH' | 'ALL' | 'ABORT' | 'EMPTY' | ''
  const [view, setView] = useState<ViewBatchesType>('')
  const pendingAnimals = breeding.animals.filter(
    ({ status }) => status === 'PENDING'
  )
  const abortAnimals = breeding.animals.filter(
    ({ status }) => status === 'ABORT'
  )
  const birthAnimals = breeding.animals.filter(
    ({ status }) => status === 'BIRTH'
  )
  const emptyAnimals = breeding.animals.filter(
    ({ status }) => status === 'EMPTY'
  )

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
          <button onClick={() => handleSetView('ALL')}>
            Todos {`(${breeding?.animals?.length || 0})`}
          </button>
        </span>
        <span>
          <button onClick={() => handleSetView('PENDING')}>
            Espera {`(${pendingAnimals?.length || 0})`}
          </button>
        </span>
        <span>
          <button onClick={() => handleSetView('ABORT')}>
            Abortos {`(${abortAnimals?.length || 0})`}
          </button>
        </span>
        <span>
          <button onClick={() => handleSetView('BIRTH')}>
            Partos {`(${birthAnimals?.length || 0})`}
          </button>
        </span>
        <span>
          <button onClick={() => handleSetView('EMPTY')}>
            Vacios {`(${emptyAnimals?.length || 0})`}
          </button>
        </span>
      </div>
      <div>
        {view === 'ALL' &&
          breeding.animals.map((animal, i) => (
            <AnimalBreedingCard
              key={i}
              animal={animal as AnimalBreedingCardType}
            />
          ))}
        {view === 'PENDING' &&
          pendingAnimals.map((animal, i) => (
            <AnimalBreedingCard
              key={i}
              animal={animal as AnimalBreedingCardType}
            />
          ))}
        {view === 'ABORT' &&
          abortAnimals.map((animal, i) => (
            <AnimalBreedingCard
              key={i}
              animal={animal as AnimalBreedingCardType}
            />
          ))}
        {view === 'BIRTH' &&
          birthAnimals.map((animal, i) => (
            <AnimalBreedingCard
              key={i}
              animal={animal as AnimalBreedingCardType}
            />
          ))}
        {view === 'EMPTY' &&
          emptyAnimals.map((animal, i) => (
            <AnimalBreedingCard
              key={i}
              animal={animal as AnimalBreedingCardType}
            />
          ))}
      </div>
    </main>
  )
}

export default BreedingBatchesList
