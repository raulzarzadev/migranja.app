import { AnimalDetails } from '@comps/AnimalCard'
import AnimalsTable from '@comps/AnimalsTable'
import { WEANING_STATUS_LABELS } from '@comps/FarmEvents/FarmEvent/WeaningEventCard'
import { IconStatus } from '@comps/IconBreedingStatus'
import DebouncedInput from '@comps/inputs/DebouncedInput'
import Modal from '@comps/modal'
import ModalEditWeaning from '@comps/modal/ModalEditWeaning'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmEvents } from 'store/slices/farmSlice'
import { AnimalType } from 'types/base/AnimalType.model'
import { myFormatDate } from 'utils/dates/myDateUtils'
import { defineStatusByDate } from 'utils/defineStatusByDate'

const WeaningEvents = () => {
  const events = useSelector(selectFarmEvents)
  const farmAnimals = useSelector(selectFarmAnimals)
  const weaning = events
    .filter((event) => event.type === 'WEANING')
    .filter((event) => event.eventData.status !== 'DONE')
    .filter((event) => event.eventData.status !== 'DONE')
    .sort((a, b) => {
      if (a.eventData.date > b.eventData.date) return 1
      if (a.eventData.date < b.eventData.date) return -1
      return 0
    })

  const [openAnimal, setOpenAnimal] = useState(false)
  const [animal, setAnimal] = useState<AnimalType | undefined>(undefined)
  const handleOpenAnimal = (earring?: string) => {
    setOpenAnimal(!openAnimal)
    if (earring) {
      setAnimal(farmAnimals.find((animal) => animal.earring === earring))
    } else {
      setAnimal(undefined)
    }
  }

  return (
    <div className="w-full p-2">
      {animal && (
        <Modal
          title="Detalles de animal"
          open={openAnimal}
          handleOpen={() => handleOpenAnimal()}
        >
          <AnimalDetails animal={animal} />
        </Modal>
      )}
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
                  <button
                    onClick={(e) => {
                      handleOpenAnimal(event?.eventData.earring)
                    }}
                  >
                    {event?.eventData?.earring}
                  </button>
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
