import Modal from '@comps/modal'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import { OVINE_DAYS } from 'FARM_CONFIG/FARM_DATES'
import { ReactNode, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmEvents } from 'store/slices/farmSlice'
import { AnimalType } from 'types/base/AnimalType.model'
import { calculateFarmNumbers } from './farmNumbers.helper'

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
        <StatCardWithModalAnimalsList
          title="Primerisas"
          animals={farmNumbers.femalesBetween(
            OVINE_DAYS.canBePregnant,
            OVINE_DAYS.canBePregnant + 90
          )}
          description={`Entre ${OVINE_DAYS.canBePregnant} y ${
            OVINE_DAYS.canBePregnant + 90
          } dias`}
        />
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
          animals={farmNumbers.malesBetween(OVINE_DAYS.canBePregnant, 9000)}
          description={`Mas de ${OVINE_DAYS.canBePregnant} dias`}
        />
      </StatsRow>
    </div>
  )
}

const StatCardWithModalAnimalsList = ({
  animals,
  description = 'desc',
  title,
  ...rest
}: {
  animals: AnimalType[]
  description: string
  title: string
}) => {
  const [openList, setOpenList] = useState(false)
  const handleOpenList = () => {
    setOpenList(!openList)
  }
  return (
    <>
      <div
        className="w-[200px]"
        onClick={(e) => {
          e.preventDefault()
          handleOpenList()
        }}
      >
        <StatCard
          {...rest}
          quantity={animals.length}
          title={title}
          description={description}
        />
      </div>
      <Modal
        open={openList}
        handleOpen={handleOpenList}
        title={`Lista de aretes: ${title} `}
      >
        <AnimalsList animals={animals} />
      </Modal>
    </>
  )
}

const AnimalsList = ({ animals }: { animals: AnimalType[] }) => {
  const sortedByEarring = animals.sort((a, b) => {
    if (a.earring < b.earring) return -1
    if (a.earring > b.earring) return 1
    return 0
  })
  return (
    <div className="grid grid-flow-row auto-rows-fr grid-cols-3 sm:grid-cols-6">
      {sortedByEarring?.map((animal, i) => (
        <div key={`${animal.id}-${i}`} className="m-4">
          <span className="whitespace-nowrap">
            <ModalAnimalDetails earring={animal.earring} />
          </span>
        </div>
      ))}
    </div>
  )
}

const StatsRow = ({
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
        <div className="flex flex-row gap-2 overflow-x-auto overflow-y-hidden  h-[135px] items-top  snap-x">
          {children}
        </div>
      </div>
    </div>
  )
}

const StatCard = ({
  title = 'title',
  quantity = 0,
  description = 'description'
}) => {
  return (
    <div className="stats shadow bg-base-200 w-full ">
      <div className="stat">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{quantity}</div>
        <div className="stat-desc">{description}</div>
      </div>
    </div>
  )
}

export default FarmNumbers
