import React from 'react'
import useEvent from './hooks/useEvent'
import { Button } from '@mui/material'
import useAnimal from './hooks/useAnimal'
import { updateAnimal } from '@firebase/Animal/main'
import { deleteEvent } from '@firebase/Events/main'
import { AnimalType } from 'types/base/AnimalType.model'

const CardEventDropOut = ({ eventId }: { eventId: string }) => {
  const { event } = useEvent({ eventId })
  console.log({ event })
  const handleRevertDropOut = () => {
    console.log('Revertir baja')
  }
  return (
    <div>
      <h1>Baja</h1>
      {event?.eventData?.animals?.map((animal: AnimalType) => (
        <AnimalEventRow
          key={animal.id}
          animalId={animal.id}
          eventId={event.id as string}
        />
      ))}

      {/* Add your component code here */}
    </div>
  )
}

const AnimalEventRow = ({
  animalId,
  eventId
}: {
  animalId: string
  eventId: string
}) => {
  const { animal } = useAnimal({ animalId })
  return (
    <div className="w-full flex justify-evenly my-8">
      <span>Arete: {animal?.earring}</span>
      <span>{!!animal?.name && `Nombre: ${animal?.name}`}</span>
      <Button
        variant="outlined"
        onClick={() => {
          console.log('Revertir baja')
          updateAnimal(animalId, {
            pastState: 'DROP_OUT',
            state: animal?.pastState || 'ACTIVE'
          })
            .then((res) => {
              console.log(res)
              deleteEvent(eventId)
                .then((res) => {
                  console.log(res)
                })
                .catch((err) => {
                  console.error(err)
                })
            })
            .catch((err) => {
              console.error(err)
            })
        }}
      >
        Revertir baja
      </Button>
    </div>
  )
}

export default CardEventDropOut
