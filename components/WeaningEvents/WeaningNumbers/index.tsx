import { FarmEvent } from 'types/base/FarmEvent.model'
import StatCardWithModalEvents from './StatCardWithModalEvents'
import { addDays } from 'date-fns'
import { AnimalFormattedWhitGenericEvenData } from 'types/base/AnimalType.model'

const WeaningNumbers = ({
  weaning
}: {
  weaning: AnimalFormattedWhitGenericEvenData[]
}) => {
  const DAYS_FORWARD_TODAY = 5

  const format = weaning.map(
    ({
      userId,
      type,
      createdAt,
      farm,
      id,
      updatedAt,
      status,
      eventData: { date, earring }
    }) => ({
      earring,
      type,
      createdAt,
      farm,
      id,
      updatedAt,
      userId,
      status,
      date
    })
  )
  const past = format.filter(
    (e) =>
      (e?.date as number) < addDays(new Date(), DAYS_FORWARD_TODAY).getTime()
  )

  const upcoming = format.filter(
    (e) =>
      (e?.date as number) > addDays(new Date(), DAYS_FORWARD_TODAY).getTime()
  )

  return (
    <div className="flex flex-wrap gap-2 ">
      <StatCardWithModalEvents
        title="Destetes pasados"
        description="Listos para destetar"
        events={past}
      />
      <StatCardWithModalEvents
        title="Destetes próximos"
        description="5 días y mas"
        events={upcoming}
      />
    </div>
  )
}

export default WeaningNumbers
