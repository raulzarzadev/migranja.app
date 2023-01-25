import { OtherBreedingMale } from 'types/base/FarmEvent.model'
import { myFormatDate } from 'utils/dates/myDateUtils'

interface OtherMaleTable extends OtherBreedingMale {
  className?: string
}
export const MalesTable = ({ males }: { males: OtherMaleTable[] }) => {
  return (
    <div className="text-xs">
      <h1 className="text-sm text-end font-bold">Macho (s)</h1>
      <div className="grid grid-cols-5 font-bold text-center">
        <div>Color</div>
        <div>Arete</div>
        <div>Raza</div>
        <div>del</div>
        <div>al</div>
      </div>
      <div>
        {males.map((male, i) => (
          <div
            className={`grid grid-cols-5 text-center `}
            key={`${male?.id}-${i}`}
          >
            <div className={`${male.className} w-5 h-5 mx-auto`}></div>
            <MaleRow male={male} />
          </div>
        ))}
      </div>
    </div>
  )
}
export const MaleRow = ({
  male: { earring, name, breed, startAt, finishAt }
}: {
  male: OtherMaleTable
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
