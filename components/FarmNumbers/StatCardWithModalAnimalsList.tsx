import Modal from '@comps/modal'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import AnimalsOptions from '@comps/OvinesTable/AnimalsOptions'
import { useEffect, useState } from 'react'
import { AnimalType } from 'types/base/AnimalType.model'
import { StatCard } from '.'
import PrintableAnimalsNumberList from './PrintableAnimalsNumberList'

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
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([])
  return (
    <>
      <div
        className=""
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
      {openList && (
        <Modal
          open={openList}
          handleOpen={handleOpenList}
          title={`Lista de aretes: ${title} `}
        >
          <div className="relative">
            <PrintableAnimalsNumberList
              animals={animals}
              title={title}
              earringsSelected={selectedAnimals}
              setEarringsSelected={setSelectedAnimals}
            />
            <AnimalsOptions animalsEarrings={selectedAnimals} title={title} />
          </div>
        </Modal>
      )}
    </>
  )
}

export default StatCardWithModalAnimalsList
