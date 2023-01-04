import { myFormatDate } from 'utils/dates/myDateUtils'
import {
  BirthDetailsEvent,
  GenericEventType
} from './FarmEvent/FarmEvent.model'
const BirthEventDetails = ({
  event
}: {
  event: GenericEventType<BirthDetailsEvent>
}) => {
  const father = event.eventData.parents.father
  const mother = event.eventData.parents.mother
  const birthData = event?.eventData
  // console.log(event)

  return (
    <div className="">
      <div>
        Fecha: {birthData?.date && myFormatDate(birthData?.date, 'dd-MMM-yy')}
      </div>
      <div>
        <span className="mr-2">Lote {birthData?.batch}</span>
      </div>
      <div className="flex items-center mx-auto w-full justify-center">
        <span className="mr-2">Genetica</span>
        <div className="flex flex-col ">
          <span>madre: {mother?.earring}</span>
          <span>padre: {father?.earring}</span>
        </div>
      </div>
      <div>
        {birthData && (
          <div>
            <div>Aretes: {birthData?.calfs?.length}</div>
            <div className="flex justify-evenly mt-2">
              {birthData?.calfs?.map((calf) => (
                <div key={calf?.earring}>
                  <div>{calf?.earring}</div>
                  <div></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BirthEventDetails
