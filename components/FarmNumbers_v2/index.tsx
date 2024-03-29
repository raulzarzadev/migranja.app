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

  const femaleAnimals = farmAnimals.filter(({ gender }) => gender === 'female')
  const maleAnimals = farmAnimals.filter(({ gender }) => gender === 'male')

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
        title: 'Lactantes ',
        subTitle: 'Recien nacidas, aun mamado, (-70 dias)',
        animals: activeAnimals.filter(({ state }) => state === 'LACTATING')
      },
      {
        title: 'Hembras ',
        subTitle: 'Hembras activas',
        animals: activeFemales
      },

      {
        title: 'Machos ',
        subTitle: 'Macho activas',
        animals: activeMales
      }
    ],
    Hembras: [
      {
        title: 'Lactando',
        subTitle: ' Hembras recien paridas',
        animals: activeFemales.filter(({ state }) => state === 'SUCKLE')
      },
      {
        title: 'Lactantes',
        subTitle: 'Hembras recien nacidas',
        animals: activeFemales.filter(({ state }) => state === 'LACTATING')
      },

      {
        title: 'Gestates',
        subTitle: 'Hembras diagnosticadas como gestates',
        animals: activeFemales.filter(({ state }) => state === 'PREGNANT')
      },
      {
        title: 'Corderas ',
        subTitle: 'Hembras para monta pero muy jovenes',
        animals: activeFemales.filter(({ state }) => state === 'FOR_BELLY')
      },
      {
        title: 'Libres',
        subTitle: 'Hembras listas para monta',
        animals: activeFemales.filter(({ state }) => state === 'FREE')
      },
      {
        title: 'En monta',
        subTitle: 'Hembras en montas pero sin verificar estado',
        animals: activeFemales.filter(({ state }) => state === 'BREEDING')
      },

      {
        title: 'Engorda',
        subTitle: 'Hembras destinadas a engorda',
        animals: activeFemales.filter(({ state }) => state === 'FATTEN')
      },

      {
        title: 'Vendidas',
        subTitle: 'Hembras vendidas',
        animals: femaleAnimals.filter(({ state }) => state === 'SOLD')
      },

      {
        title: 'Muertas',
        subTitle: 'Hembras muertas',
        animals: femaleAnimals.filter(({ state }) => state === 'DEAD')
      },
      {
        title: 'Para venta',
        subTitle: 'Hembras listas para venderse',
        animals: activeFemales.filter(({ state }) => state === 'FOR_SALE')
      }
      // {
      //   title: 'Libres',
      //   subTitle: 'En edad pero sin compromisos',
      //   animals: activeFemales.filter(({ state }) => state === 'FREE')
      // }
    ],
    Machos: [
      {
        title: 'Lactantes',
        subTitle: 'Recien nacidos',
        animals: activeMales.filter(({ state }) => state === 'LACTATING')
      },
      {
        title: 'Engorda',
        subTitle: 'En engorda',
        animals: activeMales.filter(({ state }) => state === 'FATTEN')
      },
      {
        title: 'Sementales',
        subTitle: 'Sementales activos',
        animals: activeMales.filter((animal) => animal.isStallion)
      },

      {
        title: 'Para venta',
        subTitle: 'Listos para venta',
        animals: activeMales.filter(({ state }) => state === 'FOR_SALE')
      },

      {
        title: 'Vendidos',
        subTitle: 'Vendidos',
        animals: maleAnimals.filter(({ state }) => state === 'SOLD')
      },
      {
        title: 'Muertos',
        subTitle: 'Muertos ',
        animals: maleAnimals.filter(({ state }) => state === 'DEAD')
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
    <div className="w-full ">
      <h2 className="text-xl font-bold text-center ">
        Animales por estado actual
      </h2>

      {Object.entries(animalsByStates).map(([key, cardStats]) => (
        <StatsRow title={key} key={key}>
          {cardStats.map((stat) => (
            <StatCardWithModalAnimalsList
              key={stat.title}
              //* Title of each number square
              title={`${key[0]}-${stat.title} `}
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
    <section className="">
      <h3 className="text-lg font-bold">{title}</h3>
      <section className=" flex w-full flex-wrap gap-2">{children}</section>
    </section>
  )
}

export const StatCard = ({
  title = 'title',
  quantity = 0,
  description = 'description'
}) => {
  return (
    <div className="stats shadow bg-base-200 cursor-pointer hover:shadow-none active:shadow-inner  w-full">
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
