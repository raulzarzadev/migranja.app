import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmEvents } from 'store/slices/farmSlice'
import { activeAnimalsStates, AnimalState } from 'types/base/AnimalState.model'
import { animalsBetweenDays } from './farmNumbers.helper'
import StatCardWithModalAnimalsList from './StatCardWithModalAnimalsList'

const FarmNumbers = () => {
  const farmAnimals = useSelector(selectFarmAnimals)
  // const farmEvents = useSelector(selectFarmEvents)
  const activeAnimals = farmAnimals.filter((animal) => {
    animal.state
    if (animal.state === undefined) return true
    return activeAnimalsStates.includes(animal?.state)
  })

  const femaleAnimals = activeAnimals.filter(
    ({ gender }) => gender === 'female'
  )
  const maleAnimals = activeAnimals.filter(({ gender }) => gender === 'male')
  const activeFemales = activeAnimals.filter(
    ({ gender }) => gender === 'female'
  )
  const activeMales = activeAnimals.filter(({ gender }) => gender === 'male')

  //* Animals by state

  interface NumberRow {
    title: string
    subTitle: string
    animals: any[]
  }
  const animalsByStates: Record<string, NumberRow[]> = {
    Total: [
      {
        title: 'Activos ',
        subTitle: 'Todos los animales activos',
        animals: activeAnimals
      },
      {
        title: 'En egorda ',
        subTitle: 'Todos los animales en engorda',
        animals: activeAnimals.filter(({ state }) => state === 'FATTEN')
      },
      {
        title: 'Muertos ',
        subTitle: 'Todos los animales muertos',
        animals: farmAnimals.filter(({ state }) => state === 'DEAD')
      },
      {
        title: 'Vendidos ',
        subTitle: 'Todos los animales vendidos',
        animals: farmAnimals.filter(({ state }) => state === 'SOLD')
      }
    ],
    Hembras: [
      {
        title: 'Libres',
        subTitle: 'En edad pero sin compromisos',
        animals: activeFemales.filter(({ state }) => state === 'FREE')
      },
      {
        title: 'Engorda',
        subTitle: 'En edad pero sin compromisos',
        animals: activeFemales.filter(({ state }) => state === 'FATTEN')
      },
      {
        title: 'En monta',
        subTitle: 'Preñadas o no',
        animals: activeFemales.filter(({ state }) => state === 'BREEDING')
      },
      {
        title: 'Amamantando',
        subTitle: 'Recien paridas',
        animals: activeFemales.filter(({ state }) => state === 'SUCKLE')
      },
      {
        title: 'Lactandes',
        subTitle: 'Aun mamando',
        animals: femaleAnimals.filter(({ state }) => state === 'LACTATING')
      },
      {
        title: 'Corderas ',
        subTitle: 'Para monta pero muy jovenes',
        animals: activeFemales.filter(({ state }) => state === 'FOR_BELLY')
      },
      {
        title: 'Para venta',
        subTitle: 'Listas para venderse',
        animals: activeFemales.filter(({ state }) => state === 'FOR_SALE')
      },
      {
        title: 'Muertas',
        subTitle: 'Hembras muertas',
        animals: activeFemales.filter(({ state }) => state === 'DEAD')
      },
      {
        title: 'Vendidas',
        subTitle: 'Hembras vendidas',
        animals: activeFemales.filter(({ state }) => state === 'SOLD')
      }
    ],
    Machos: [
      {
        title: 'Sementales',
        subTitle: 'Sementales activos',
        animals: activeMales.filter((animal) => animal.isStallion)
      },
      {
        title: 'Engorda',
        subTitle: 'En engorda',
        animals: activeMales.filter(({ state }) => state === 'FATTEN')
      },
      {
        title: 'Lactandes',
        subTitle: 'Aun mamando',
        animals: activeMales.filter(({ state }) => state === 'LACTATING')
      },
      {
        title: 'En venta',
        subTitle: 'Listos para venta',
        animals: activeMales.filter(({ state }) => state === 'FOR_SALE')
      },

      {
        title: 'Muertos',
        subTitle: 'Muertos ',
        animals: activeMales.filter(({ state }) => state === 'DEAD')
      },
      {
        title: 'Vendidos',
        subTitle: 'Vendidos',
        animals: activeMales.filter(({ state }) => state === 'SOLD')
      }
    ]
  }

  const animalsByAge: Record<string, NumberRow[]> = {
    Total: [
      {
        title: 'Todos ',
        subTitle: 'Todas las borregas',
        animals: activeAnimals
      },
      {
        title: '0-70 días',
        subTitle: 'menores de 70 dias',
        animals: animalsBetweenDays(activeAnimals, 0, 70)
      },
      {
        title: '71-210 días',
        subTitle: 'Entre 71-210 dias',
        animals: animalsBetweenDays(activeAnimals, 71, 210)
      },
      {
        title: '210-245 días',
        subTitle: 'Entre 210 y 245 dias',
        animals: animalsBetweenDays(activeAnimals, 210, 245)
      },
      {
        title: '+245 días',
        subTitle: 'Mayores de 245 dias',
        animals: animalsBetweenDays(activeAnimals, 245, 99999)
      }
    ],
    Hembras: [
      {
        title: 'Todas ',
        subTitle: 'Hembras activas',
        animals: activeFemales
      },
      {
        title: '0-70 días',
        subTitle: 'Hembras entre 0 y 70 días',
        animals: animalsBetweenDays(activeFemales, 0, 70)
      },
      {
        title: '71-210 días',
        subTitle: 'Hembras entre 71 y 210 días',
        animals: animalsBetweenDays(activeFemales, 71, 210)
      },
      {
        title: '210-245 días',
        subTitle: 'Hembras entre 210 y 245 días',
        animals: animalsBetweenDays(activeFemales, 210, 245)
      },

      {
        title: '+245',
        subTitle: 'Mayores de 254 dias',
        animals: animalsBetweenDays(activeFemales, 245, 9999)
      }
    ],
    Machos: [
      {
        title: 'Todos ',
        subTitle: 'Machos activos ',
        animals: activeMales
      },
      {
        title: '0-70 días',
        subTitle: 'Machos activos entre 0-70 días',
        animals: animalsBetweenDays(activeMales, 0, 70)
      },
      {
        title: '71-210 días',
        subTitle: 'Machos activos entre 71-210 días',
        animals: animalsBetweenDays(activeMales, 71, 210)
      },
      {
        title: '210-245 días',
        subTitle: 'Machos activos entre 210 y 245 días',
        animals: animalsBetweenDays(activeMales, 210, 245)
      },

      {
        title: '+245',
        subTitle: 'Machos mayores de 254 dias',
        animals: animalsBetweenDays(activeMales, 245, 9999)
      }
    ]
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-center ">
        Animales por estado actual
      </h2>

      {Object.entries(animalsByStates).map(([key, cardStats]) => (
        <StatsRow title={key} key={key}>
          {cardStats.map((stat) => (
            <StatCardWithModalAnimalsList
              key={stat.title}
              title={stat.title}
              animals={stat.animals}
              description={stat.subTitle}
            />
          ))}
        </StatsRow>
      ))}

      <h2 className="text-xl font-bold text-center ">Animales por edad</h2>

      {Object.entries(animalsByAge).map(([key, cardStats]) => (
        <StatsRow title={key} key={key}>
          {cardStats.map((stat) => (
            <StatCardWithModalAnimalsList
              key={stat.title}
              title={stat.title}
              animals={stat.animals}
              description={stat.subTitle}
            />
          ))}
        </StatsRow>
      ))}
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
    <div className="stats shadow bg-base-200 cursor-pointer hover:shadow-none active:shadow-inner  w-[120px]">
      <div className="stat">
        <div className="stat-title truncate">{title}</div>
        <div className="stat-value">{quantity}</div>
        <div className="stat-desc truncate">
          <span className="">{description}</span>
        </div>
      </div>
    </div>
  )
}

export default FarmNumbers
