import Icon from '@comps/Icon'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import IconBreedingStatus from 'components/IconBreedingStatus'
import { useState } from 'react'
import { AnimalBreedingEventCard } from 'types/base/FarmEvent.model'
import { animalCurrentStatusLabels } from 'types/base/LABELS_TYPES/AnimalCurrentStatus'
import AnimalBreedingOptions from './AnimalBreedingOptions'

const AnimalBreedingCardSmall = ({
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

  return (
    <>
      {openModal && (
        <AnimalBreedingOptions
          animal={animal}
          handleOpenModal={handleOpenModal}
          openModal={openModal}
        />
      )}

      <div className={`bg-base-300 my-2 rounded-md shadow-md  `}>
        <div className="flex justify-between items-center px-2 pt-1 w-full ">
          <span>
            Arete:
            <span className="ml-4 ">
              <ModalAnimalDetails earring={breedingFemale.earring} />
              {breedingFemale.name}
            </span>
          </span>
          <span>
            <span className="mx-4">
              <IconBreedingStatus
                finishInDays={breedingDates?.birthFinishInDays}
                startInDays={breedingDates?.birthStartInDays}
              />
            </span>
            {animalCurrentStatusLabels[breedingFemale.status || 'PENDING']}
          </span>
          <span className="p-1">
            <button
              className="text-info"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleOpenModal()
              }}
            >
              <Icon name="event" />
            </button>
          </span>
          {/* <span>{disableOptionsModal || <EventModal event={{}} />}</span> */}
        </div>
        <div className="text-center"></div>
      </div>
    </>
  )
}
export default AnimalBreedingCardSmall
