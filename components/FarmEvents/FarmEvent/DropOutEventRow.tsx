import LinkFarmAnimal from '@comps/Buttons&Links/LinkFarmAnimal'
import { FarmEventDropOut } from 'types/base/FarmEventDropOut.model'
import { myFormatDate } from 'utils/dates/myDateUtils'

export const DROP_IN_DROP_OUT_LABELS: Record<
  FarmEventDropOut['reason'],
  string
> = {
  DEAD: 'Muerte',
  STOLE: 'Robo',
  SOLD: 'Venta',
  LOST: 'Perdida',
  BIRTH: 'Nacimiento',
  BUY: 'Compra'
}
const DropOutEventRow = ({ event }: { event: FarmEventDropOut }) => {
  return (
    <div>
      <h4 className="text-center">{DROP_IN_DROP_OUT_LABELS[event.reason]}</h4>
      <div>Fecha: {myFormatDate(event.eventData.date, 'dd MMM yy')}</div>
      <div>
        <div>Animales:</div>
        {event.eventData.animals.map((animal) => (
          <div key={animal.id}>
            {animal.earring} {animal.name}{' '}
            <LinkFarmAnimal animalEarringOrId={animal.id} />
          </div>
        ))}
      </div>
      <div>Comentarios: {event.eventData.comments}</div>
      <div>creado por: {event.createdBy.name}</div>
    </div>
  )
}

export default DropOutEventRow
