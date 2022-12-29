import { EventType } from '@firebase/Events/event.model'
import { getFarmBreedings } from '@firebase/Events/main'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import useFarm from 'components/hooks/useFarm'
import { useEffect, useState } from 'react'
import { myFormatDate } from 'utils/dates/myDateUtils'
import { calculatePossibleBirth } from './breeding.helpers'

export interface BreedingType extends AnimalType {
  breeding?: any
}

const BreedingsList = () => {
  const { currentFarm } = useFarm()
  const [animals, setAnimals] = useState<Partial<BreedingType>[]>([])
  const formatBreedings = (breedings: EventType[]): Partial<BreedingType>[] => {
    let animals: Partial<BreedingType>[] = []
    breedings.forEach((breeding) => {
      const animalsAux: Partial<BreedingType>[] = breeding?.breedingBatch?.map(
        (animal) => {
          return {
            ...animal,
            breeding
          }
        }
      )
      animals = [...animals, ...animalsAux]
    })
    return animals
  }
  useEffect(() => {
    currentFarm.id &&
      getFarmBreedings(currentFarm.id).then((res) =>
        setAnimals(formatBreedings(res))
      )
  }, [currentFarm.id])

  return (
    <div className="w-full">
      {animals.map((animal, i) => (
        <AnimalBreeding key={`${animal.id}-${i}`} animal={animal} />
      ))}
    </div>
  )
}

const AnimalBreeding = ({ animal }: { animal: Partial<BreedingType> }) => {
  const possibleBirth = calculatePossibleBirth(animal.breeding)
  return (
    <div className="bg-base-300 my-2 rounded-md shadow-md  ">
      <header className="flex w-full justify-between p-2 bg-base-200 rounded-t-md">
        <span>
          Parto: del
          <span className="font-bold">
            {myFormatDate(possibleBirth.startAt, 'dd-MMM')}
          </span>
          al
          <span className="font-bold">
            {myFormatDate(possibleBirth.finishAt, 'dd-MMM')}
          </span>
        </span>
        <span>
          Arete: <span className="font-bold">{animal.earring}</span>
        </span>
      </header>
      <main className="p-2">
        <div className="flex w-full justify-evenly">
          <div className="flex flex-col text-center">
            <span>Fecha Monta</span>
            <div>
              <span>{myFormatDate(animal.breeding.startAt, 'dd-MMM-yy')}</span>
              <span className="mx-2">al</span>
              <span>{myFormatDate(animal.breeding.finishAt, 'dd-MMM-yy')}</span>
            </div>
          </div>
          <div className="flex flex-col text-center">
            <span>Macho</span>
            <div>
              <span className="mx-2">{animal.earring}</span>
              <span>{animal?.name || ''}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default BreedingsList
