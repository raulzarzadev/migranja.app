import Icon from '@comps/Icon'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { selectFarmState } from 'store/slices/farmSlice'

const LinkFarmAnimal = ({
  farmId,
  animalEarringOrId = ''
}: {
  farmId?: string
  animalEarringOrId?: string
}) => {
  const currentFarm = useSelector(selectFarmState)
  return (
    <span className="mx-2 text-xs">
      <Link
        className="link "
        href={`/${farmId || currentFarm?.id}/animals/${animalEarringOrId}`}
      >
        ver
      </Link>
    </span>
  )
}

export default LinkFarmAnimal
