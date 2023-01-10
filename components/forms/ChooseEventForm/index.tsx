import { useState } from 'react'
import { AnimalType } from 'types/base/AnimalType.model'
import DropInForm from '../DropInForm'
import DropOutForm from '../DropOutForm'

const ChooseEventForm = ({
  animalsIds
}: {
  animalsIds: AnimalType['id'][]
}) => {
  const EVENTS_FORMS = {
    default: <DefaultFormInfo />,
    dropOut: <DropOutForm animalsIds={animalsIds} />,
    dropIn: <DropInForm animalsIds={animalsIds} />
  } as const
  type EventName = keyof typeof EVENTS_FORMS

  const [optionSelected, setOptionSelected] = useState<EventName>('default')

  return (
    <div>
      <select
        className="input select input-bordered w-full"
        onChange={({ target: { value } }: any) => setOptionSelected(value)}
      >
        <option value={'default'}> Selecciona el tipo de evento</option>
        <option value={'dropOut'}> Dar de baja</option>
        <option value={'dropIn'}> Dar de alta</option>
      </select>
      {EVENTS_FORMS[optionSelected || 'default']}
    </div>
  )
}

const DefaultFormInfo = () => {
  return (
    <div className="h-32 w-full max-w-2/3 flex justify-center items-center">
      Segun el evento, habra diferentes campos que llenar. Se cuidadoso
    </div>
  )
}

export default ChooseEventForm
