import Icon from '@comps/Icon'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import IconBreedingStatus from 'components/IconBreedingStatus'
import { useState } from 'react'
import { AnimalBreedingEventCard } from 'types/base/FarmEvent.model'
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'
import AnimalBreedingOptions from './AnimalBreedingOptions'
import { AnimalState } from 'types/base/AnimalState.model'

const AnimalBreedingCard = ({
  animal
}: {
  animal: AnimalBreedingEventCard
}) => {
  const breedingDates = animal?.eventData?.breedingDates
  const breedingData = animal?.eventData
  const breedingMale = animal.eventData?.breedingMale
  const breedingFemale = animal

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
          animalId={animal.id || ''}
          handleOpenModal={handleOpenModal}
          openModal={openModal}
          breedingId={animal.eventData.id}
        />
      )}

      <div
        className={`bg-base-200 my-2 rounded-md shadow-md ${
          disableOptionsModal && ' opacity-50  shadow-none'
        } `}
      >
        <div className="flex justify-between items-center px-2 pt-1 w-full ">
          <span></span>
          <span>
            <span className="">
              Monta:{' '}
              <span className="font-bold"> {breedingData?.breedingId} </span>
            </span>
          </span>
          <span className="p-1">
            <button
              className="text-info"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                disableOptionsModal || handleOpenModal()
              }}
            >
              <Icon name="event" />
            </button>
          </span>
          {/* <span>{disableOptionsModal || <EventModal event={{}} />}</span> */}
        </div>
        <div className="text-center"></div>
        <header className="flex w-full justify-between p-2 bg-base-200 ">
          <div className="flex items-center ">
            <IconBreedingStatus
              finishInDays={breedingDates?.birthFinishInDays}
              startInDays={breedingDates?.birthStartInDays}
            />
            <span className="flex flex-col">
              <span>
                Partos:{' '}
                <span className="font-bold">
                  {breedingDates?.birthStartAt &&
                    myFormatDate(breedingDates?.birthStartAt, 'dd-MMM')}
                </span>{' '}
                <span className="">al </span>
                <span className="font-bold">
                  {breedingDates?.birthFinishAt &&
                    myFormatDate(breedingDates?.birthFinishAt, 'dd-MMM yyyy')}
                </span>
              </span>
              <span className="text-xs italic">
                {fromNow(breedingDates?.birthStartAt, { addSuffix: true })}
              </span>
            </span>
          </div>

          <span className="flex flex-col">
            <span>
              Hembra:{' '}
              <span className=" whitespace-nowrap">
                <ModalAnimalDetails earring={breedingFemale.earring} />
              </span>
            </span>
            <span>{AnimalState[animal?.status || 'PENDING']}</span>

            <span className="text-xs">
              <span className="">{breedingFemale.breed}</span>
            </span>
          </span>
        </header>
        <main className="p-2">
          <div className="flex w-full justify-evenly">
            <div className="flex flex-col text-center">
              <span>Fecha Monta</span>
              <div>
                <span>
                  {myFormatDate(breedingDates?.breedingStartAt, 'dd-MMM')}
                </span>
                <span className="mx-2 text-xs italic">al</span>
                <span>
                  {myFormatDate(breedingDates?.breedingFinishAt, 'dd-MMM-yy')}
                </span>
              </div>
            </div>
            <div className="flex flex-col text-center">
              <span>Macho</span>
              <div>
                <span className="mx-2 ">
                  <ModalAnimalDetails earring={breedingMale?.earring} />
                </span>

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
