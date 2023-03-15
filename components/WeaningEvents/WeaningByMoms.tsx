import H2 from '@comps/Basics/Title2'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import { Entries } from 'type-fest'

const WeaningByMoms = ({ mothers }: { mothers: any }) => {
  const entries = Object.entries(mothers) as Entries<typeof mothers>
  //AnimalFormattedWhitGenericEvenData[]
  return (
    <div>
      <div>
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th className="text-center">Madre</th>
              <th className="">Crias</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(mothers).map(([momEarring, weanings]: any) => (
              <tr key={momEarring}>
                <td className="text-center">
                  <ModalAnimalDetails earring={momEarring} size="normal" />
                </td>
                <td>
                  <div className=" w-full grid grid-flow-col gap-3 justify-start">
                    {weanings?.map(
                      (weaning: {
                        eventData: { earring: null | undefined }
                      }) => (
                        <div key={weaning.eventData.earring}>
                          <ModalAnimalDetails
                            earring={weaning.eventData.earring || ''}
                            size="normal"
                          />
                          {}
                        </div>
                      )
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default WeaningByMoms
