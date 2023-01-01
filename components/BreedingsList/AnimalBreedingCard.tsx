import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import useFarm from 'components/hooks/useFarm'
import IconBreedingStatus from 'components/IconBreedingStatus'
import { useState } from 'react'
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'
import AnimalBreedingOptions from './AnimalBreedingOptions'

export interface AnimalBreedingCardType extends Partial<AnimalType> {
  breedingDates: {
    birthStartAt: number | Date
    birthFinishAt: number | Date
    breedingStartAt: number | Date
    breedingFinishAt: number | Date
    birthStartInDays: number
    birthFinishInDays: number
  }
}
const AnimalBreedingCard = ({ animal }: { animal: AnimalBreedingCardType }) => {
  const { currentFarm } = useFarm()

  const lastVersionOfBreedingMale =
    currentFarm.animals?.find(
      ({ id }) => id === animal.breeding.breedingMale.id
    ) || animal.breeding.breedingMale

  const lastVersionAnimal =
    currentFarm.animals?.find(({ id }) => id === animal.id) || animal

  const breedingMale = lastVersionOfBreedingMale
  const {
    breedingDates: {
      birthStartAt,
      birthFinishAt,
      birthStartInDays,
      birthFinishInDays,
      breedingFinishAt,
      breedingStartAt
    }
  } = { ...animal }

  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }

  const disableOptionsModal = ['ABORT', 'BIRTH', 'EMPTY'].includes(
    animal?.status || ''
  )

  return (
    <>
      {openModal && (
        <AnimalBreedingOptions
          animal={animal}
          handleOpenModal={handleOpenModal}
          openModal={openModal}
        />
      )}

      <div
        className={`bg-base-300 my-2 rounded-md shadow-md ${
          disableOptionsModal && ' opacity-50  shadow-none'
        } `}
        onClick={() => {
          disableOptionsModal || handleOpenModal()
        }}
      >
        <header className="flex w-full justify-between p-2 bg-base-200 rounded-t-md">
          <div className="flex items-center ">
            <IconBreedingStatus
              finishInDays={birthFinishInDays}
              startInDays={birthStartInDays}
            />
            <span className="flex flex-col">
              {animal.status || 'PENDING'}
              <span>
                Parto: del{' '}
                <span className="font-bold">
                  {birthStartAt && myFormatDate(birthStartAt, 'dd-MMM')}
                </span>{' '}
                al{' '}
                <span className="font-bold">
                  {birthFinishAt && myFormatDate(birthFinishAt, 'dd-MMM yyyy')}
                </span>
              </span>
              <span className="text-xs italic">
                {fromNow(birthStartAt, { addSuffix: true })}
              </span>
            </span>
          </div>

          <span className="flex flex-col">
            <span>
              Arete:{' '}
              <span className="font-bold whitespace-nowrap">
                {lastVersionAnimal.earring}
              </span>
            </span>
            <span className="text-xs">
              Lote: <span className="font-bold">{lastVersionAnimal.batch}</span>
            </span>
            <span className="text-xs">
              <span className="">{lastVersionAnimal.breed}</span>
            </span>
          </span>
        </header>
        <main className="p-2">
          <div className="flex w-full justify-evenly">
            <div className="flex flex-col text-center">
              <span>Fecha Monta</span>
              <div>
                <span>{myFormatDate(breedingStartAt, 'dd-MMM-yy')}</span>
                <span className="mx-2">al</span>
                <span>{myFormatDate(breedingFinishAt, 'dd-MMM-yy')}</span>
              </div>
            </div>
            <div className="flex flex-col text-center">
              <span>Macho</span>
              <div>
                <span className="mx-2 font-bold">{breedingMale?.earring}</span>

                <span>{breedingMale?.name || ''}</span>
              </div>
            </div>
            <span>raza:{breedingMale?.breed || ''}</span>
          </div>
        </main>
      </div>
    </>
  )
}
export default AnimalBreedingCard
