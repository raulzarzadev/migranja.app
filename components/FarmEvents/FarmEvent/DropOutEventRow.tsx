import { FarmEventDropOut } from 'types/base/FarmEventDropOut.model'
import { myFormatDate } from 'utils/dates/myDateUtils'

const DropOutEventRow = ({ event }: { event: FarmEventDropOut }) => {
  const labels: Record<FarmEventDropOut['reason'], string> = {
    DEAD: 'Muerte',
    STOLE: 'Robo',
    SOLD: 'Venta',
    LOST: 'Perdida'
  }
  return (
    <div>
      <h4 className="text-center">{labels[event.reason]}</h4>
      <div>Fecha: {myFormatDate(event.eventData.date, 'dd MMM yy')}</div>
      <div>
        <div>Animales:</div>
        {event.eventData.animals.map((animal) => (
          <div key={animal.id}>
            {animal.earring} {animal.name}
          </div>
        ))}
      </div>
      <div>Comentarios: {event.eventData.comments}</div>
      <div>creado por: {event.createdBy.name}</div>
    </div>
  )
}

export default DropOutEventRow
