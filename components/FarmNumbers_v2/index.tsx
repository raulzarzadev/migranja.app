import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmEvents } from 'store/slices/farmSlice'
import { activeAnimalsStates } from 'types/base/AnimalState.model'
import { AnimalType } from 'types/base/AnimalType.model'
import { animalsBetweenDays } from './farmNumbers.helper'
import StatCardWithModalAnimalsList from './StatCardWithModalAnimalsList'

const FarmNumbers = () => {
  const farmAnimals = useSelector(selectFarmAnimals)
  // const farmEvents = useSelector(selectFarmEvents)
  const activeAnimals = farmAnimals.filter((animal) => {
    if (animal.state === undefined) return true
    return activeAnimalsStates.includes(animal?.state)
  })

  const femaleAnimals = activeAnimals.filter(
    ({ gender }) => gender === 'female'
  )
  const maleAnimals = activeAnimals.filter(({ gender }) => gender === 'male')

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-center ">Numeros y estadístcas</h2>
      <StatsRow title="Animales">
        <StatCardWithModalAnimalsList
          title="Activos"
          animals={activeAnimals}
          description="Todos los animals "
        />

        <StatCardWithModalAnimalsList
          title="0-3 meses"
          animals={animalsBetweenDays(activeAnimals, 0, 90)}
          description="menores de 3 meses"
        />
        <StatCardWithModalAnimalsList
          title="3-5 meses"
          animals={animalsBetweenDays(activeAnimals, 90, 150)}
          description="entre 3 y 5 meses"
        />
        <StatCardWithModalAnimalsList
          title="5-12 meses"
          animals={animalsBetweenDays(activeAnimals, 150, 365)}
          description="Entre 5 meses y 1 año"
        />
        <StatCardWithModalAnimalsList
          title="1 y 3 años"
          animals={animalsBetweenDays(activeAnimals, 365, 365 * 3)}
          description="Entre 1 y 3 años"
        />
        <StatCardWithModalAnimalsList
          title="Mas de 3 años"
          animals={animalsBetweenDays(activeAnimals, 3 * 365, 99999999)}
          description="Mayores de 3 años"
        />
      </StatsRow>

      <StatsRow title="Hembras">
        <StatCardWithModalAnimalsList
          title="Hembras"
          animals={femaleAnimals}
          description="Hembras"
        />
        <StatCardWithModalAnimalsList
          title="0-3 meses"
          animals={animalsBetweenDays(femaleAnimals, 0, 90)}
          description="menores de 3 meses"
        />
        <StatCardWithModalAnimalsList
          title="3-5 meses"
          animals={animalsBetweenDays(femaleAnimals, 90, 150)}
          description="entre 3 y 5 meses"
        />
        <StatCardWithModalAnimalsList
          title="5-12 meses"
          animals={animalsBetweenDays(femaleAnimals, 150, 365)}
          description="Entre 5 meses y 1 año"
        />
        <StatCardWithModalAnimalsList
          title="1 y 3 años"
          animals={animalsBetweenDays(femaleAnimals, 365, 365 * 3)}
          description="Entre 1 y 3 años"
        />
        <StatCardWithModalAnimalsList
          title="Mas de 3 años"
          animals={animalsBetweenDays(femaleAnimals, 3 * 365, 99999999)}
          description="Mayores de 3 años"
        />
      </StatsRow>

      <StatsRow title="Machos">
        <StatCardWithModalAnimalsList
          title="Machos"
          animals={maleAnimals}
          description="Machos"
        />
        <StatCardWithModalAnimalsList
          title="0-3 meses"
          animals={animalsBetweenDays(maleAnimals, 0, 89)}
          description="menores de 3 meses"
        />
        <StatCardWithModalAnimalsList
          title="3-5 meses"
          animals={animalsBetweenDays(maleAnimals, 90, 149)}
          description="entre 3 y 5 meses"
        />
        <StatCardWithModalAnimalsList
          title="5-12 meses"
          animals={animalsBetweenDays(maleAnimals, 150, 364)}
          description="Entre 5 meses y 1 año"
        />
        <StatCardWithModalAnimalsList
          title="1 y 3 años"
          animals={animalsBetweenDays(maleAnimals, 365, 365 * 3)}
          description="Entre 1 y 3 años"
        />
        <StatCardWithModalAnimalsList
          title="+3 años"
          animals={animalsBetweenDays(maleAnimals, 3 * 365, 99999999)}
          description="Mayores de 3 años"
        />
      </StatsRow>
    </div>
  )
}

export const StatsRow = ({
  title = 'Title',
  children
}: {
  title: string
  children: ReactNode
}) => {
  return (
    <div className="">
      <h3 className="text-lg font-bold">{title}</h3>
      <div className="grid">
        <div className="flex flex-row gap-2 overflow-x-auto overflow-y-hidden  h-[135px] items-top  snap-x ">
          {children}
        </div>
      </div>
    </div>
  )
}

export const StatCard = ({
  title = 'title',
  quantity = 0,
  description = 'description'
}) => {
  return (
    <div className="stats shadow bg-base-200 cursor-pointer hover:shadow-none active:shadow-inner  w-[200px]">
      <div className="stat">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{quantity}</div>
        <div className="stat-desc truncate">
          <span className="">{description}</span>
        </div>
      </div>
    </div>
  )
}

export default FarmNumbers