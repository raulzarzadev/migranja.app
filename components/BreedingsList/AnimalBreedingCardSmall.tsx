import Icon from '@comps/Icon'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import IconBreedingStatus from 'components/IconBreedingStatus'
import { useState } from 'react'
import { AnimalBreedingEventCard } from 'types/base/FarmEvent.model'
import { animalCurrentStatusLabels } from 'types/base/LABELS_TYPES/AnimalCurrentStatus'
import AnimalBreedingOptions from './AnimalBreedingOptions'
import IconStatus from '@comps/IconStatus'

const AnimalBreedingCardSmall = ({
  animal,
  hiddenEvents
}: {
  animal: AnimalBreedingEventCard
  hiddenEvents?: boolean
}) => {
  const breedingDates = animal?.eventData?.breedingDates
  const breedingFemale = animal

  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }
  // console.log({ animal })

  return (
    <>
      {openModal && (
        <AnimalBreedingOptions
          animal={animal}
          handleOpenModal={handleOpenModal}
          openModal={openModal}
        />
      )}

      <button
        className={`bg-base-300 my-2 rounded-md shadow-md  w-full  hover:shadow-inner`}
        onClick={(e) => {
          if (!hiddenEvents) {
            e.preventDefault()
            e.stopPropagation()
            handleOpenModal()
          }
        }}
      >
        <div className="flex justify-evenly items-center px-2 py-1 w-full ">
          <span>
            Arete:
            <span className="ml-4 ">
              <ModalAnimalDetails
                earring={breedingFemale.earring}
                size="normal"
              />
              {breedingFemale.name}
            </span>
          </span>
          <span>
            <span className="mx-4">
              <span className="mx-2">
                {animalCurrentStatusLabels[breedingFemale.status || 'PENDING']}
              </span>

              {animal.status === 'BIRTH' && <IconStatus status="success" />}
              {animal.status === 'PENDING' && (
                <IconBreedingStatus
                  finishInDays={breedingDates?.birthFinishInDays}
                  startInDays={breedingDates?.birthStartInDays}
                />
              )}
            </span>
          </span>
        </div>
      </button>
    </>
  )
}
export default AnimalBreedingCardSmall
