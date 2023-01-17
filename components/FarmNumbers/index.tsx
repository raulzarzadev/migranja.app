import useSortByField from '@comps/hooks/useSortByField'
import Modal from '@comps/modal'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import { ReactNode, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals } from 'store/slices/farmSlice'
import { AnimalType } from 'types/base/AnimalType.model'
import { calculateFarmNumbers } from './farmNumbers.helper'

const FarmNumbers = () => {
  const farmAnimals = useSelector(selectFarmAnimals)
  const farmNumbers = calculateFarmNumbers(farmAnimals)
  return (
    <div>
      <h2 className="text-xl font-bold text-center">Numeros y estadistcas</h2>
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

      <StatsRow title="Por edades">
        <StatCardWithModalAnimalsList
          title="- 70 dias"
          animals={farmNumbers.activeBetween(0, 70)}
          description="Menores de 70 dias "
        />
        <StatCardWithModalAnimalsList
          title="entre 70 y 120 dias"
          animals={farmNumbers.activeBetween(70, 120)}
          description="Entre 70 y 120 dias"
        />
        <StatCardWithModalAnimalsList
          title="Edad reproductiva"
          animals={farmNumbers.activeBetween(220, 1000)}
          description="Entre 220 y 1000 dias"
        />
        <StatCardWithModalAnimalsList
          title="Edad avanzada"
          animals={farmNumbers.activeBetween(900, 9000)}
          description="Mas de 900 dias"
        />
      </StatsRow>
      <StatsRow title="Hembras">
        <StatCardWithModalAnimalsList
          title="- 70 dias"
          animals={farmNumbers.femalesBetween(0, 70)}
          description="Menores de 70 dias "
        />
        <StatCardWithModalAnimalsList
          title="entre 70 y 120 dias"
          animals={farmNumbers.femalesBetween(70, 120)}
          description="Entre 70 y 120 dias"
        />
        <StatCardWithModalAnimalsList
          title="Edad reproductiva"
          animals={farmNumbers.femalesBetween(220, 1000)}
          description="Entre 220 y 1000 dias"
        />
        <StatCardWithModalAnimalsList
          title="Edad avanzada"
          animals={farmNumbers.femalesBetween(900, 9000)}
          description="Mas de 900 dias"
        />
      </StatsRow>

      <StatsRow title="Machos">
        <StatCardWithModalAnimalsList
          title="- 70 dias"
          animals={farmNumbers.malesBetween(0, 70)}
          description="Menores de 70 dias "
        />
        <StatCardWithModalAnimalsList
          title="entre 70 y 120 dias"
          animals={farmNumbers.malesBetween(70, 120)}
          description="Entre 70 y 120 dias"
        />
        <StatCardWithModalAnimalsList
          title="En engorda"
          animals={farmNumbers.malesBetween(120, 1000)}
          description="Entre 120 y 220 dias"
        />
        <StatCardWithModalAnimalsList
          title="Edad avanzada"
          animals={farmNumbers.malesBetween(900, 9000)}
          description="Mas de 900 dias"
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
        <StatCard {...rest} quantity={animals.length} title={title} />
      </div>
      <Modal
        open={openList}
        handleOpen={handleOpenList}
        title={`Aretes: ${title} `}
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
    <div className="grid grid-flow-row auto-rows-fr grid-cols-6">
      {sortedByEarring?.map((animal) => (
        <div key={animal.id} className="m-4">
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
