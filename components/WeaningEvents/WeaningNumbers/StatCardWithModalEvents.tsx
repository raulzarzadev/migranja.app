import Modal from '@comps/modal'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import AnimalsOptions from '@comps/OvinesTable/AnimalsOptions'
import { useEffect, useState } from 'react'
import { AnimalType } from 'types/base/AnimalType.model'
import { StatCard } from '../../FarmNumbers'
import PrintableAnimalsNumberList from '../../FarmNumbers/PrintableAnimalsNumberList'

const StatCardWithModalEvents = ({
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

export interface NumbersAnimalListType {
  title: string
  animals: AnimalType[]
  earringsSelected?: string[]
  setEarringsSelected?: (earring: string[]) => void
}
export const AnimalsList = ({
  animals,
  title,
  setEarringsSelected,
  earringsSelected
}: NumbersAnimalListType) => {
  const earringsWithOutSuffix = animals?.filter(
    //* Verify if exist and if have suffix
    (a) => a && !a?.earring?.includes('-')
  )
  const earringsWithSuffix = animals?.filter((a) => a?.earring?.includes('-'))

  const sortByNumber = (a: any, b: any) => {
    const aEarring = parseFloat(a?.earring.split('-')[0] || '0')
    const bEarring = parseFloat(b?.earring.split('-')[0] || '0')

    if (aEarring < bEarring) return -1
    if (aEarring > bEarring) return 1
    return 0
  }
  const sortedByEarring = earringsWithOutSuffix.sort(sortByNumber)
  const sortedSuffixByEarring = earringsWithSuffix.sort(sortByNumber)

  useEffect(() => {
    if (earringsSelected) {
      _setEarringsSelected(earringsSelected)
    }
  }, [earringsSelected])

  const [_earringsSelected, _setEarringsSelected] = useState<string[]>([])

  const onSelectEarring = (earring: string, checked: boolean) => {
    if (checked) {
      _setEarringsSelected([..._earringsSelected, earring])
      setEarringsSelected?.([..._earringsSelected, earring])
    } else {
      const index = _earringsSelected.indexOf(earring)
      _earringsSelected.splice(index, 1)
      _setEarringsSelected([..._earringsSelected])
      setEarringsSelected?.([..._earringsSelected])
    }
  }

  const onSelectAll = (checked: boolean) => {
    const allEarrings = animals.map(({ earring }) => earring)
    if (checked) {
      _setEarringsSelected([...allEarrings])
      setEarringsSelected?.([...allEarrings])
    } else {
      _setEarringsSelected([])
      setEarringsSelected?.([])
    }
  }

  return (
    <div className="relative">
      <div className="grid grid-flow-row auto-rows-fr grid-cols-3 sm:grid-cols-6">
        {[...sortedSuffixByEarring, ...sortedByEarring]?.map(
          ({ earring }, i) => (
            <div key={`${earring}-${i}`} className="m-1">
              <span className="whitespace-nowrap flex items-end">
                <input
                  type={'checkbox'}
                  onChange={(e) => {
                    onSelectEarring(earring, e.target.checked)
                  }}
                  className={'checkbox checkbox-sm bg-transparent'}
                  checked={_earringsSelected?.includes(earring)}
                />
                <ModalAnimalDetails earring={earring} size="sm" />
              </span>
            </div>
          )
        )}
      </div>
      <div className=" flex justify-end items-center">
        {' '}
        <input
          type={'checkbox'}
          onChange={(e) => {
            onSelectAll(e.target.checked)
          }}
          className={'checkbox checkbox-sm bg-transparent mr-2 '}
          checked={_earringsSelected.length === animals.length}
        />
        Total: {animals.length}
      </div>
    </div>
  )
}

export default StatCardWithModalEvents
