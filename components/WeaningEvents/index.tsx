import _ from 'lodash'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmEvents } from 'store/slices/farmSlice'
import WeaningByEarring from './WeaningByEarring'
import WeaningByMoms from './WeaningByMoms'

const WeaningEvents = () => {
  const events = useSelector(selectFarmEvents)
  const animalsFarm = useSelector(selectFarmAnimals)
  const weaning = events
    .filter((event) => event.type === 'WEANING')
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
    <div className="w-full p-2">
      <h2 className="text-2xl font-bold text-center">Destetes Programados</h2>
      <div>Pendientes: {weaning.length}</div>
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
      </div>
      {viewSelected === 'byEarring' && <WeaningByEarring weaning={weaning} />}
      {viewSelected === 'byMothers' && (
        <WeaningByMoms mothers={weaningByMoms} />
      )}
    </div>
  )
}

export default WeaningEvents
