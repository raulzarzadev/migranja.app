import { AnimalDetails } from '@comps/AnimalCard'
import { EventsList } from '@comps/FarmEvents/EventsList'
import MyTable from '@comps/MyTable'
import TableDate from '@comps/MyTable/TableDate'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import { useSelector } from 'react-redux'
import { selectFarmEvents } from 'store/slices/farmSlice'
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'

const BirthEvents = () => {
  const events = useSelector(selectFarmEvents)
  const births = events.filter((event) => event.type === 'BIRTH')
  console.log({ births })
  return (
    <div className="w-full">
      <MyTable
        title="Lista de partos"
        headers={{
          date: {
            label: 'Fecha',
            format: (props) => <TableDate date={props} />
          },
          litter: {
            label: 'Camada',
            format: (p) => (
              <span>
                {p.split(',').map((earring) => (
                  <ModalAnimalDetails
                    earring={earring}
                    size="normal"
                    key={earring}
                  />
                ))}
              </span>
            )
          },
          // updatedAt: {
          //   label: 'Actualizado',
          //   format: (e) => fromNow(e, { addSuffix: true })
          // },
          mom: {
            label: 'Madre',
            format: (p) => (
              <span>
                {p.split(',').map((earring) => (
                  <ModalAnimalDetails
                    earring={earring}
                    size="normal"
                    key={earring}
                  />
                ))}
              </span>
            )
          },
          dad: {
            label: 'Padre',
            format: (p) => (
              <span>
                {p.split(',').map((earring) => (
                  <ModalAnimalDetails
                    earring={earring}
                    size="normal"
                    key={earring}
                  />
                ))}
              </span>
            )
          }
        }}
        data={births.map((e) => ({
          litter: e.eventData.calfs?.map((a) => a.earring).join(','),
          date: e.eventData.date,
          //updatedAt: e.updatedAt,
          mom: e.eventData.parents.mother?.earring,
          dad: e.eventData.parents.father?.earring
        }))}
        showGlobalFilter
      />
      {/* <EventsList events={births} /> */}
    </div>
  )
}

export default BirthEvents
