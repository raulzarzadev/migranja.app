import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import { OtherBreedingMale } from 'types/base/FarmEvent.model'
import { myFormatDate } from 'utils/dates/myDateUtils'

interface OtherMaleTable extends OtherBreedingMale {
  className?: string
}
export const MalesTable = ({
  males,
  showColor
}: {
  males: OtherMaleTable[]
  showColor?: boolean
}) => {
  return (
    <div className="text-xs w-full mx-auto">
      <h1 className="text-sm text-end font-bold ">Macho (s)</h1>
      <div className="grid grid-cols-5 font-bold text-center  ">
        {showColor && (
          <div>
            Color <span className="text-xs font-normal">(calendario)</span>
          </div>
        )}
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
            {showColor && (
              <div
                className={`${male.className} w-5 h-5 mx-auto flex justify-center items-center text-[10px]`}
              >
                {i + 1}
              </div>
            )}
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
      <div className="truncate">
        <ModalAnimalDetails earring={earring} size="sm" /> {name}{' '}
      </div>
      <div className="truncate">{breed}</div>
      <div className="truncate">{myFormatDate(startAt, 'dd-MMM')}</div>
      <div className="truncate">{myFormatDate(finishAt, 'dd-MMM-yy')}</div>
    </>
  )
}
