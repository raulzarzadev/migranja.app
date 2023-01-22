import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import { FarmEventDropOut } from 'types/base/FarmEventDropOut.model'
import { myFormatDate } from 'utils/dates/myDateUtils'

export const DROP_IN_OUT_LABELS = {
  DEAD: 'Muerte',
  STOLEN: 'Robo',
  SOLD: 'Venta',
  LOST: 'Perdida',
  BIRTH: 'Nacimiento',
  BUY: 'Compra'
} as const

export type DorpInOutReasonsType = keyof typeof DROP_IN_OUT_LABELS

const DropOutEventRow = ({ event }: { event: FarmEventDropOut }) => {
  return (
    <div>
      <h4 className="text-center">
        {DROP_IN_OUT_LABELS[event.reason as DorpInOutReasonsType]}
      </h4>
      <div>Fecha: {myFormatDate(event.eventData.date, 'dd MMM yy')}</div>
      <div>
        <div>Animales:</div>
        {event.eventData.animals.map((animal) => (
          <div key={animal.id}>
            <ModalAnimalDetails earring={animal.earring} size="sm" />{' '}
            {animal.name}
          </div>
        ))}
      </div>
      <div>Comentarios: {event.eventData.comments}</div>
      <div>creado por: {event.createdBy.name}</div>
    </div>
  )
}

export default DropOutEventRow
