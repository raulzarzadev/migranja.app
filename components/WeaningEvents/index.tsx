import { WEANING_STATUS_LABELS } from '@comps/FarmEvents/FarmEvent/WeaningEventCard'
import { IconStatus } from '@comps/IconBreedingStatus'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import ModalEditWeaning from '@comps/modal/ModalEditWeaning'
import { useSelector } from 'react-redux'
import { selectFarmEvents } from 'store/slices/farmSlice'
import { myFormatDate } from 'utils/dates/myDateUtils'
import { defineStatusByDate } from 'utils/defineStatusByDate'

const WeaningEvents = () => {
  const events = useSelector(selectFarmEvents)
  const weaning = events
    .filter((event) => event.type === 'WEANING')
    .filter((event) => event.eventData.status !== 'DONE')
    .filter((event) => event.eventData.status !== 'DONE')
    .sort((a, b) => {
      if (a.eventData.date > b.eventData.date) return 1
      if (a.eventData.date < b.eventData.date) return -1
      return 0
    })

  return (
    <div className="w-full p-2">
      <h2 className="text-2xl font-bold text-center">Destetes Programados</h2>
      <div>Pendientes: {weaning.length}</div>
      {/* <AnimalsTable
        animalsData={weaning.map((event) =>
          farmAnimals.find(
            (animal) => event.eventData.earring === animal.earring
          )
        )}
      /> */}
      {/* <DebouncedInput
        value={globalFilter ?? ''}
        onChange={(value) => setGlobalFilter(String(value))}
        className=" input input-sm w-full input-bordered"
        placeholder="Buscar por arete..."
      /> */}
      <div className="">
        <table className="table w-full table-compact">
          <thead>
            <tr>
              <th>Arete</th>
              <th>Fecha</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="">
            {weaning.map((event) => (
              <tr
                key={event.id}
                className="bg-base-300 rounded-md my-2 p-1 px-2"
              >
                <td>
                  <ModalAnimalDetails earring={event.eventData.earring} />
                </td>
                <td>{myFormatDate(event?.eventData?.date, 'dd MMM yy')}</td>

                <td>
                  <span>
                    <IconStatus
                      status={
                        defineStatusByDate(event?.eventData?.date as number) ||
                        'info'
                      }
                    />{' '}
                  </span>
                  <span>{WEANING_STATUS_LABELS[event?.eventData?.status]}</span>
                  <ModalEditWeaning eventId={event.id || ''} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default WeaningEvents
