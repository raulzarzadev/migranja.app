import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import EventModal from 'components/FarmEvents/EventModal'
import IconBreedingStatus from 'components/IconBreedingStatus'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import { AnimalFormattedWhitGenericEvenData } from 'types/base/AnimalType.model'
import {
  BreedingDetailsEvent,
  SetGenericEventType
} from 'types/base/FarmEvent.model'
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'
import AnimalBreedingOptions from './AnimalBreedingOptions'
import { BreedingDatesType } from './breeding.helpers'

// export interface AnimalFormattedWhitGenericEvenData extends Partial<AnimalType> {
//   breedingDates: BreedingDatesType
// }
const AnimalBreedingCard = ({
  animal
}: {
  animal: AnimalFormattedWhitGenericEvenData
}) => {
  // const { farmAnimals } = useFarm()
  // const farmAnimals = useSelector(selectFarmAnimals)
  const breedingDates = animal?.eventData?.breedingDates
  const breedingData = animal?.eventData
  const breedingMale = animal.eventData?.breedingMale
  const breedingFemale = animal

  //return <></>
  // const breedingInf = animal.breeding

  // const lastVersionOfBreedingMale =
  //   farmAnimals?.find(({ id }) => id === animal?.breeding?.breedingMale?.id) ||
  //   animal?.breeding?.breedingMale

  // const lastVersionAnimal =
  //   farmAnimals?.find(({ id }) => id === animal.id) || animal

  //const breedingMale = lastVersionOfBreedingMale

  // const {
  //   breedingDates: {
  //     birthStartAt,
  //     birthFinishAt,
  //     birthStartInDays,
  //     birthFinishInDays,
  //     breedingFinishAt,
  //     breedingStartAt
  //   }
  // } = { ...animal.breeding }

  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }

  const disableOptionsModal = ['ABORT', 'BIRTH', 'EMPTY'].includes(
    animal?.status || ''
  )

  // const event: SetGenericEventType<BreedingDetailsEvent> = {
  //   createdAt: breeding?.date,
  //   id: breeding?.id,
  //   // parents: breeding?.parents,
  //   type: 'BREEDING',
  //   updatedAt: breeding?.updatedAt,
  //   eventData: breeding.eventData,
  //   userId: breeding.userId,
  //   farm: breeding.farm
  // }
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
        <div className="flex justify-between items-center px-2 pt-1 w-full ">
          <span></span>
          <span>
            Monta
            <span className="text-xs h-full">
              <span className=""> {breedingData?.breedingId} </span>
            </span>
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
              <span>{animal.status || 'PENDING'}</span>
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
              Arete:{' '}
              <span className="font-bold whitespace-nowrap">
                {breedingFemale.earring}
              </span>
            </span>

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
