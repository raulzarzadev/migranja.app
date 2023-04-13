import _ from 'lodash'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmEvents } from 'store/slices/farmSlice'
import MyTable from '@comps/MyTable'
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'
import {
  TypeOfFarmEvent,
  labelsOfFarmEventTypes
} from 'types/base/LABELS_TYPES/EventTypes'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import TableDate from '@comps/MyTable/TableDate'

const WeaningEvents = () => {
  const events = useSelector(selectFarmEvents)
  const animalsFarm = useSelector(selectFarmAnimals)
  const weanings = events.filter((event) => event.type === 'WEANING')
  const weaning = weanings
    .filter((event) => event.eventData.status !== 'DONE')
    .filter((event) => event.eventData.status !== 'DONE')
    .sort((a, b) => {
      if (a.eventData.date > b.eventData.date) return 1
      if (a.eventData.date < b.eventData.date) return -1
      return 0
    })

  const weaningWithMoms = weaning.map((weaning) => ({
    ...weaning,
    animalMother:
      animalsFarm.find((animal) => animal.earring === weaning.eventData.earring)
        ?.parents?.mother?.earring || ''
  }))
  const weaningByMoms = _.groupBy(weaningWithMoms, 'animalMother')
  type Views = 'byEarring' | 'byMothers'
  const [viewSelected, setViewSelected] = useState<Views>('byMothers')
  return (
    <div className="w-full p-2 bg-base-300 rounded-md shadow-md">
      <div className="flex w-full justify-center">
        <MyTable
          showGlobalFilter
          title="Destetes programados"
          headers={{
            date: {
              label: 'Fecha',
              format: (props) => <TableDate date={props} />
            },
            earring: {
              label: 'Arete',
              format: (props) => (
                <ModalAnimalDetails earring={props} size="normal" />
              )
            },
            status: {
              label: 'Status',
              format: (props) =>
                labelsOfFarmEventTypes?.[props as TypeOfFarmEvent]
            }
          }}
          data={weanings.map((weaning) => ({
            date: weaning.eventData.date,
            earring: weaning.eventData.earring,
            status: weaning.eventData.status
          }))}
          filters={{
            Pendientes: {
              field: 'status',
              symbol: '==',
              value: 'PENDING'
            },
            Completados: {
              field: 'status',
              symbol: '==',
              value: 'DONE'
            }
            // '-2meses': {
            //   field: 'date',
            //   symbol: '>=',
            //   value: subMonths(new Date(), 2).getTime()
            // },
            // '+2meses': {
            //   field: 'date',
            //   symbol: '>=',
            //   value: addMonths(new Date(), 2).getTime()
            // }
          }}
        />
      </div>
      {/* <div>Pendientes: {weaning.length}</div>
      <div className="flex w-full justify-evenly my-2">
        Destete por:
        <button
          className={`btn ${
            viewSelected === 'byEarring' ? 'btn-sm btn-outline' : 'btn-md'
          } `}
          onClick={(e) => {
            e.preventDefault()
            setViewSelected('byMothers')
          }}
        >
          Madres
        </button>
        <button
          className={`btn ${
            viewSelected === 'byMothers' ? 'btn-sm btn-outline' : 'btn-md'
          } `}
          onClick={(e) => {
            e.preventDefault()
            setViewSelected('byEarring')
          }}
        >
          Crías
        </button>
      </div> */}
      {/* {viewSelected === 'byEarring' && <WeaningByEarring weaning={weaning} />}
      {viewSelected === 'byMothers' && (
        <WeaningByMoms mothers={weaningByMoms} />
      )} */}
    </div>
  )
}

export default WeaningEvents
