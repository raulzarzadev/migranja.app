import TableDate from '@comps/MyTable/TableDate'
import useEvent from '@comps/hooks/useEvent'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import ModalBreedingDetails from '@comps/modal/ModalBreedingDetails'

const BirthDetails = ({ birthId }: { birthId: string }) => {
  const { event } = useEvent({ eventId: birthId })
  if (!event) return <span>Evento no encontrado</span>
  return (
    <div>
      <div className="text-xs">
        <span>
          <span className="font-bold">Id:</span>
          {birthId}
        </span>
      </div>
      <span className="font-bold">Fechas:</span>
      <div className="flex w-full justify-evenly text-center my-2">
        <span>
          Fecha: <TableDate date={event?.eventData.date as number} />
        </span>
        <span>
          Creado: <TableDate date={event?.createdAt as number} />
        </span>
        <span>
          Actualizado: <TableDate date={event?.updatedAt as number} />
        </span>
      </div>
      <div>
        <span className="font-bold">Lote/Monta:</span>
        <div className="text-center my-2">
          {event?.eventData?.batch ? (
            <ModalBreedingDetails breedingBatchId={event?.eventData?.batch} />
          ) : (
            event?.eventData.breedingId && (
              <ModalBreedingDetails
                breedingBatchId={event?.eventData.breedingId}
              />
            )
          )}
        </div>
      </div>
      <div>
        <span className="font-bold">Camada:</span>
        <div className="flex w-full justify-evenly my-2">
          {event?.eventData.calfs?.map((calf, i) => (
            <div key={i}>
              <ModalAnimalDetails earring={calf.earring} />
            </div>
          ))}
        </div>
      </div>
      <div>
        <span className="font-bold">Padres:</span>
        <div className="flex justify-evenly w-full my-2">
          <span>
            Madre:{' '}
            <ModalAnimalDetails
              earring={event?.eventData?.parents?.mother?.earring}
            />
          </span>
          <span>
            Padre:
            <span className="">
              <ModalAnimalDetails
                earring={event?.eventData?.parents?.father?.earring}
              />
              <span className="text-sm">
                {event?.eventData.parents?.father?.name}
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default BirthDetails
