import Modal from '@comps/modal'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import HeaderTable from '@comps/MyTables/HeaderTable'
import AnimalsOptions from '@comps/OvinesTable/AnimalsOptions'
import { useState } from 'react'
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
            <PrintableAnimalsNumberList animals={animals} title={title} />
            <AnimalsOptions
              animalsEarrings={animals.map(({ earring }) => earring)}
              title={title}
            />
          </div>
        </Modal>
      )}
    </>
  )
}

export const AnimalsList = ({
  animals,
  title
}: {
  title: string
  animals: AnimalType[]
}) => {
  const earringsWithOutSuffix = animals.filter((a) => !a.earring.includes('-'))
  const earringsWithSuffix = animals.filter((a) => a.earring.includes('-'))
  const sortByNumber = (a: any, b: any) => {
    const aEarring = parseFloat(a?.earring.split('-')[0] || '0')
    const bEarring = parseFloat(b?.earring.split('-')[0] || '0')

    if (aEarring < bEarring) return -1
    if (aEarring > bEarring) return 1
    return 0
  }
  const sortedByEarring = earringsWithOutSuffix.sort(sortByNumber)
  const sortedSuffixByEarring = earringsWithSuffix.sort(sortByNumber)

  return (
    <div className="relative">
      <div className="grid grid-flow-row auto-rows-fr grid-cols-3 sm:grid-cols-6">
        {[...sortedSuffixByEarring, ...sortedByEarring]?.map((animal, i) => (
          <div key={`${animal?.id}-${i}`} className="m-1">
            <span className="whitespace-nowrap flex items-end">
              <div className="w-4 h-4 border border-base-content rounded-md border-opacity-20" />
              <ModalAnimalDetails earring={animal?.earring} size="sm" />
            </span>
          </div>
        ))}
      </div>
      <div className="text-end">Total: {animals.length}</div>
    </div>
  )
}

export default StatCardWithModalAnimalsList
