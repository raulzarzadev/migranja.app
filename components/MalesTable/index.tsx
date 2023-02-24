import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import ModalDelete from '@comps/modal/ModalDelete'
import { OtherBreedingMale } from 'types/base/FarmEvent.model'
import { myFormatDate } from 'utils/dates/myDateUtils'

interface OtherMaleTable extends OtherBreedingMale {
  className?: string
}

export const MalesTable = ({
  males,
  showColor,
  showOps,
  handleRemoveMale
}: {
  males: OtherMaleTable[]
  showColor?: boolean
  showOps?: boolean
  handleRemoveMale?: (index: number) => void
}) => {
  return (
    <div className="text-xs w-full mx-auto my-4">
      <h1 className="text-sm text-center font-bold ">Macho (s)</h1>
      <table className="mx-auto w-full text-center">
        {/* <thead className="  ">
          <tr>
            {showColor && (
              <th>
                Color <span className="text-xs font-normal">(calendario)</span>
              </th>
            )}
            <th>Arete</th>
            <th>del</th>
            <th>al</th>
            {showOps && <th>Ops</th>}
          </tr>
        </thead> */}
        <tbody className="">
          {males.map((male, i) => (
            <tr className={`even:bg-base-200  `} key={`${male?.id}-${i} `}>
              {showColor && (
                <td
                  className={`${male.className} w-5 h-5 mx-auto flex justify-center items-center text-[10px] `}
                >
                  {i + 1}
                </td>
              )}
              <MaleRow male={male} />
              {showOps && i != 0 && (
                <td>
                  <ModalDelete
                    smallIcon
                    title="Remover macho"
                    //* should be i + 1 becouse you dont want to delete the firstOne
                    handleDelete={() => handleRemoveMale?.(i - 1)}
                    text="Descarta este macho (y fechas) de la monta.  "
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
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
      <td className="truncate">
        <ModalAnimalDetails earring={earring} size="sm" /> {name} {breed}
      </td>
      <td className="truncate">{myFormatDate(startAt, 'dd-MMM')}</td>
      <td className="truncate">{myFormatDate(finishAt, 'dd-MMM-yy')}</td>
    </>
  )
}
