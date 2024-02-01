import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import IconBreedingStatus from 'components/IconBreedingStatus'
import { ReactNode, useState } from 'react'
import { AnimalBreedingEventCard } from 'types/base/FarmEvent.model'
import IconStatus from '@comps/IconStatus'
import ModalBirthDetails from '@comps/modal/ModalBirthDetails'
import React from 'react'
import AnimalBreedingOptions from '@comps/modal/AnimalBreedingOptions'
import { EventType } from '@firebase/Events/event.model'
import useEvents from '@comps/hooks/useEvents'
import { AnimalState } from 'types/base/AnimalState.model'
import { AnimalType } from 'types/base/AnimalType.model'
import useEvent from '@comps/hooks/useEvent'
import useAnimal from '@comps/hooks/useAnimal'
import { calculatePossibleBirthStartAndFinish } from './breeding.helpers'
import useModal from '@comps/hooks/useModal'
import Modal from '@comps/modal'

const AnimalBreedingCardSmall = ({
  animalId,
  breedingId
}: {
  animalId: AnimalType['id']
  breedingId: EventType['id']
}) => {
  const { event: breeding } = useEvent({ eventId: breedingId })
  const breedingAnimal = breeding?.eventData.breedingBatch.find(
    (a) => a.id === animalId
  )
  const breedingDates = calculatePossibleBirthStartAndFinish({
    finishAt: Number(breeding?.eventData.finishAt),
    startAt: Number(breeding?.eventData.startAt)
  })

  const { animal } = useAnimal({ animalId })
  const modal = useModal()

  if (breedingAnimal?.earring === '236') {
    console.log({ animal })
    console.log({ breedingAnimal })
  }

  const isDead = animal?.state === 'DEAD'
  return (
    <section
      onClick={(e) => {
        modal.handleOpen()
      }}
      className="grid grid-cols-2 place-content-center  w-full bg-base-200 rounded-md p-2 "
    >
      <Modal {...modal} title="Opciones de monta">
        <AnimalBreedingOptions
          breedingId={breedingId}
          motherId={animalId}
          isDead={isDead}
        />
      </Modal>
      <div>
        Arete:
        <ModalAnimalDetails animalId={animalId} />
      </div>
      <div className="flex items-center">
        {isDead ? (
          <IconStatus status="error" />
        ) : (
          <>
            {breedingAnimal?.status === 'BIRTH' && (
              <IconStatus status="success" />
            )}
            {breedingAnimal?.status === 'PENDING' && (
              <IconBreedingStatus
                finishInDays={breedingDates?.birthFinishInDays}
                startInDays={breedingDates?.birthStartInDays}
              />
            )}
            {breedingAnimal?.status === 'PREGNANT' && (
              <IconStatus status="warning" />
            )}
          </>
        )}
        <span className="ml-2">
          {isDead
            ? AnimalState.DEAD
            : AnimalState[breedingAnimal?.status || 'PENDING']}
        </span>
      </div>
    </section>
  )
  // const breedingDates = animal?.eventData?.breedingDates
  // const breedingFemale = animal
  // //const birthId = animal?.birthEventData?.birthEventId || ''
  // const batchName = animal.eventData.breedingId
  // const motherId = animal.id
  // const { events } = useEvents()
  // const birthId =
  //   animal?.birthEventData?.birthEventId ||
  //   events.find(
  //     (e) =>
  //       e.eventData.breedingId === batchName &&
  //       e?.eventData?.parents?.mother?.id === motherId
  //   )?.id
  // const WrapperBreedingCard = (
  //   props: JSX.IntrinsicAttributes & { children?: ReactNode }
  // ) => {
  //   if (animal.status === 'BIRTH')
  //     return (
  //       <ModalBirthDetails birthId={birthId || ''} fullWidth>
  //         {props.children}
  //       </ModalBirthDetails>
  //     )
  //   if (animal.status === 'PENDING')
  //     return (
  //       <ModalAnimalBreedingOptions
  //         breedingId={breedingId}
  //         motherId={animal?.id || ''}
  //       >
  //         {props.children}
  //       </ModalAnimalBreedingOptions>
  //     )
  //   return <React.Fragment {...props} />
  // }
  // return (
  //   <WrapperBreedingCard>
  //     <div
  //       className={`bg-base-300 my-2 rounded-md shadow-md  w-full  hover:shadow-inner`}
  //     >
  //       <div className="flex justify-evenly items-center px-2 py-1 w-full ">
  //         <span>
  //           Arete:
  //           <span className="ml-4 ">
  //             <ModalAnimalDetails
  //               earring={breedingFemale.earring}
  //               size="normal"
  //             />
  //             {breedingFemale.name}
  //           </span>
  //         </span>
  //         <span>
  //           <span className="mx-4">
  //             <span className="mx-2">
  //               {AnimalState[breedingFemale.status || 'PENDING']}
  //             </span>
  //             {animal.status === 'BIRTH' && <IconStatus status="success" />}
  //             {animal.status === 'PENDING' && (
  //               <IconBreedingStatus
  //                 finishInDays={breedingDates?.birthFinishInDays}
  //                 startInDays={breedingDates?.birthStartInDays}
  //               />
  //             )}
  //             {animal.status === 'PREGNANT' && <IconStatus status="warning" />}
  //           </span>
  //         </span>
  //       </div>
  //     </div>
  //   </WrapperBreedingCard>
  // )
}
export default AnimalBreedingCardSmall
