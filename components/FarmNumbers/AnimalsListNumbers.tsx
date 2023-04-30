import { useEffect, useState } from 'react'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'

export interface NumbersAnimalListType {
  title: string
  animals: { id?: string; earring: string }[]
  earringsSelected?: string[]
  setEarringsSelected?: (earring: string[]) => void
}
export const AnimalsListNumbers = ({
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
    const aEarring = parseFloat(a?.earring?.split('-')[0] || '0')
    const bEarring = parseFloat(b?.earring?.split('-')[0] || '0')

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

export default AnimalsListNumbers
