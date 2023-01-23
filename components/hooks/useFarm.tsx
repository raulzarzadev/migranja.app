import { getFarm } from '@firebase/Farm/main'
import { useEffect, useState } from 'react'

const useFarm = ({ farmId }: { farmId?: string }) => {
  const [farm, setFarm] = useState<any>(undefined)
  useEffect(() => {
    if (farmId) {
      getFarm(farmId)
        .then((res) => setFarm(res))
        .catch((err) => console.log(err))
    }
  }, [farmId])

  return { farm }
}
export default useFarm
