import { myFormatDate } from 'utils/dates/myDateUtils'
import { FarmEventType } from './FarmEvent'
export interface FarmBirthEventType extends FarmEventType {}
const BirthEventDetails = ({ event }: { event: FarmBirthEventType }) => {
  const { parents } = event
  const father = parents?.father
  const mother = parents?.mother
  const birthData = event?.birthData
  console.log(event)

  return (
    <div className="">
      <div>
        Fecha: {birthData?.date && myFormatDate(birthData?.date, 'dd-MMM-yy')}
      </div>
      <div>
        <span className="mr-2">Lote {event?.birthData?.batch}</span>
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
