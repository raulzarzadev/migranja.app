import { OtherBreedingMale } from 'types/base/FarmEvent.model'
import { myFormatDate } from 'utils/dates/myDateUtils'

export const MalesTable = ({ males }: { males: OtherBreedingMale[] }) => {
  return (
    <div className="text-xs">
      <h1 className="text-sm text-end font-bold">Macho (s)</h1>
      <div className="grid grid-cols-4 font-bold text-center">
        <div>Arete</div>
        <div>Raza</div>
        <div>del</div>
        <div>al</div>
      </div>
      <div className="grid grid-cols-4 text-center ">
        {males.map((male, i) => (
          <MaleRow key={`${male?.id}-${i}`} male={male} />
        ))}
      </div>
    </div>
  )
}
export const MaleRow = ({
  male: { earring, name, breed, startAt, finishAt }
}: {
  male: OtherBreedingMale
}) => {
  return (
    <>
      <div>
        {earring} {name}{' '}
      </div>
      <div>{breed}</div>
      <div>{myFormatDate(startAt, 'dd-MMM')}</div>
      <div className="truncate">{myFormatDate(finishAt, 'dd-MMM-yy')}</div>
    </>
  )
}
