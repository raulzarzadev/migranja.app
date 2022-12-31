import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
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
  const {
    breedingDates: {
      birthStartAt,
      birthFinishAt,
      birthStartInDays,
      birthFinishInDays,
      breedingFinishAt,
      breedingStartAt
    }
  } = animal
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }

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
        className="bg-base-300 my-2 rounded-md shadow-md  "
        onClick={() => handleOpenModal()}
      >
        <header className="flex w-full justify-between p-2 bg-base-200 rounded-t-md">
          <div className="flex items-center ">
            <IconBreedingStatus
              finishInDays={birthFinishInDays}
              startInDays={birthStartInDays}
            />
            <span className="flex flex-col">
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
                {animal.earring}
              </span>
            </span>
            <span className="text-xs">
              Lote: <span className="font-bold">{animal.batch}</span>
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
                <span className="mx-2 font-bold">
                  {animal.breeding?.breedingMale?.earring}
                </span>
                <span>{animal.breeding?.breedingMale?.name || ''}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
export default AnimalBreedingCard
