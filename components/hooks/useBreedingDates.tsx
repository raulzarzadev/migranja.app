import { calculatePossibleBirthStartAndFinish } from '@comps/BreedingsList/breeding.helpers'
import useEvent from './useEvent'

const useBreedingDates = ({ breedingId }: { breedingId: string }) => {
  const { event: breeding } = useEvent({ eventId: breedingId })
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
