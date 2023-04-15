import { calculatePossibleBirthStartAndFinish } from '@comps/BreedingsList/breeding.helpers'

const useBreedingDates = ({ breedingId }: { breedingId: string }) => {
  const { event: breeding } = useFarmEvent({ eventId: breedingId })
  const finishAt = breeding?.eventData?.finishAt
  const startAt = breeding?.eventData?.startAt
  const otherMales = breeding?.eventData?.otherMales

  const breedingDates = calculatePossibleBirthStartAndFinish({
    finishAt: finishAt as number,
    startAt: startAt as number,
    otherMales
  })
  return { breedingDates }
}

export default useBreedingDates
