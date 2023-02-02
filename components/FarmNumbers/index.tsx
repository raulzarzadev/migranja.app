import { OVINE_DAYS } from 'FARM_CONFIG/FARM_DATES'
import React, { ReactNode, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmEvents } from 'store/slices/farmSlice'
import { AnimalType } from 'types/base/AnimalType.model'

import { calculateFarmNumbers } from './farmNumbers.helper'
import StatCardWithModalAnimalsList from './StatCardWithModalAnimalsList'
import StatCardWithModalEventsList from './StatCardWithModalEventsList'

const FarmNumbers = () => {
  const farmAnimals = useSelector(selectFarmAnimals)
  const farmEvents = useSelector(selectFarmEvents)

  const farmNumbers = calculateFarmNumbers({
    animals: farmAnimals,
    events: farmEvents
  })
  return (
    <div>
      <h2 className="text-xl font-bold text-center">Numeros y estadístcas</h2>
      <StatsRow title="Animales">
        <StatCardWithModalAnimalsList
          title="Total"
          animals={farmNumbers.activeAnimals}
          description="Todos los animals "
        />
        <StatCardWithModalAnimalsList
          title="Hembras"
          animals={farmNumbers.activeFemales}
          description="Hembras activos "
        />
        <StatCardWithModalAnimalsList
          title="Machos"
          animals={farmNumbers.activeMales}
          description="Machos activos "
        />
      </StatsRow>

      <StatsRow title="Hembras">
        <StatCardWithModalAnimalsList
          title="Lactantes"
          animals={farmNumbers.femalesBetween(0, OVINE_DAYS.finishWeaning)}
          description={`"Menores de ${OVINE_DAYS.finishWeaning} dias "`}
        />
        <StatCardWithModalAnimalsList
          title="Corderas"
          animals={farmNumbers.femalesBetween(
            OVINE_DAYS.finishWeaning,
            OVINE_DAYS.canBePregnant
          )}
          description={`Entre ${OVINE_DAYS.finishWeaning} y ${OVINE_DAYS.canBePregnant} dias`}
        />
        {/* <StatCardWithModalAnimalsList
          title="Primerisas"
          animals={farmNumbers.femalesBetween(
            OVINE_DAYS.canBePregnant,
            OVINE_DAYS.canBePregnant + 90
          )}
          description={`Entre ${OVINE_DAYS.canBePregnant} y ${
            OVINE_DAYS.canBePregnant + 90
          } dias`}
        /> */}
        <StatCardWithModalAnimalsList
          title="Edad reproductiva"
          animals={farmNumbers.femalesBetween(OVINE_DAYS.canBePregnant, 9999)}
          description={`Mayores de ${OVINE_DAYS.canBePregnant} dias`}
        />
        <StatCardWithModalAnimalsList
          title="Gestantes"
          animals={farmNumbers.pregnantAnimals() as AnimalType[]}
          description="En monta o antes de parir"
        />
        <StatCardWithModalAnimalsList
          title="Lactando"
          animals={
            farmNumbers.animalsLactando(
              OVINE_DAYS.finishWeaning
            ) as AnimalType[]
          }
          description="Aún amamantando "
        />
      </StatsRow>

      <StatsRow title="Machos">
        <StatCardWithModalAnimalsList
          title="Sementales"
          animals={farmAnimals.filter((animal) => animal?.isStallion)}
          description={`Sementales`}
        />
        <StatCardWithModalAnimalsList
          title="Lactantes"
          animals={farmNumbers.malesBetween(0, OVINE_DAYS.finishWeaning)}
          description={`Menores de ${OVINE_DAYS.finishWeaning} dias`}
        />

        <StatCardWithModalAnimalsList
          title="En engorda"
          animals={farmNumbers.malesBetween(
            OVINE_DAYS.finishWeaning,
            OVINE_DAYS.canBePregnant
          )}
          description={`entre ${OVINE_DAYS.finishWeaning} y ${OVINE_DAYS.canBePregnant}`}
        />

        <StatCardWithModalAnimalsList
          title="Pasados "
          animals={farmNumbers
            .malesBetween(OVINE_DAYS.canBePregnant, 9000)
            // * Exclude sementales
            .filter((animal) => !animal?.isStallion)}
          description={`Mas de ${OVINE_DAYS.canBePregnant} dias`}
        />
      </StatsRow>

      <StatsRow title="Últimos 30 días">
        <StatCardWithModalEventsList
          title="Partos"
          events={farmNumbers.birthsLastMonth}
          description={`Todos del ultimo mes`}
        />
        <StatCardWithModalAnimalsList
          title="Corderitos"
          animals={farmNumbers.newCalfsLastMonth as AnimalType[]}
          description={`Corderitos del ultimo mes`}
        />
      </StatsRow>

      <StatsRow title="Inventario">
        <StatCardWithModalEventsList
          title="Bajas"
          events={farmNumbers.dropOutAnimals}
          description={`Por muerte, perdidas o robadas`}
        />
        <StatCardWithModalEventsList
          title="Altas"
          events={farmNumbers.dropInAnimals}
          description={`Compras, nuevos lotes , etc.`}
        />
        <StatCardWithModalEventsList
          title="Partos"
          events={farmNumbers.births}
          description={`Todos en el historial`}
        />
        <StatCardWithModalAnimalsList
          title="Corderitos"
          animals={farmNumbers.newCalfs as AnimalType[]}
          description={`Corderitos nacidos`}
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
    <div>
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
