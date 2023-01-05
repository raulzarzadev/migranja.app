import { FarmStateAnimalEvent } from 'store/slices/farmSlice'
import { myFormatDate } from 'utils/dates/myDateUtils'
const BirthEventDetails = ({ event }: { event: FarmStateAnimalEvent }) => {
  const father = event.eventData.parents?.father
  const mother = event.eventData.parents?.mother
  const birthData = event?.eventData
  // console.log(event)

  return (
    <div className="">
      <div>
        Fecha: {birthData?.date && myFormatDate(birthData?.date, 'dd-MMM-yy')}
      </div>
      <div>
        <span className="mr-2">Lote {birthData?.breedingId}</span>
      </div>
      {/* <GeneticTree
        elements={{
          father: {
            id: father?.id as string,
            label: father?.earring as string
          },
          mother: {
            id: mother?.id as string,
            label: mother?.earring as string
          }
        }}
      /> */}
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
            <div>Aretes: {birthData?.breedingBatch.length}</div>
            <div className="flex justify-evenly mt-2">
              {birthData?.breedingBatch?.map((calf) => (
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
