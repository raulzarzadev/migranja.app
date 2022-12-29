import { FarmType } from '@firebase/Farm/farm.model'
import Batch from 'components/Batch'
import BatchTable from 'components/BatchTable'
import BreedingEvent from 'components/BreedingEvent'
import FarmTeam from 'components/FarmTeam'
import AnimalForm from 'components/forms/AnimalForm'
import AnimalsForm from 'components/forms/AnimalsForm'
import BatchForm, { BatchType } from 'components/forms/BatchForm'
import OvinesTable from 'components/OvinesTable'
import SquareOption from 'components/SquareOption'
import { ReactNode, useEffect, useState } from 'react'

type MenuOptions = 'column1' | 'column2' | 'column3'
type Option =
  | ''
  | 'animals'
  | 'sheep'
  | 'add'
  | 'list'
  | 'events'
  | 'team'
  | 'addMany'
  | 'addBatch'
  | 'breedingEvent'

const FarmMenu = ({ farm }: { farm: FarmType | null }) => {
  const [menuOptions, setMenuOptions] =
    useState<Partial<Record<MenuOptions, Option>>>()
  useEffect(() => {
    const localOptions = localStorage.getItem('menuOptions')
    if (!localOptions || localOptions === 'undefined') {
      setMenuOptions({ column1: '', column2: '', column3: '' })
    } else {
      setMenuOptions(JSON.parse(localOptions))
    }
  }, [])
  useEffect(() => {
    menuOptions &&
      localStorage.setItem('menuOptions', JSON.stringify(menuOptions))
  }, [menuOptions])

  if (!menuOptions) return <></>
  const { column1, column2, column3 } = menuOptions
  console.log({ column1, column2, column3 })

  const handleChangeOption = (column: MenuOptions, option: Option) => {
    if (column === 'column1')
      return setMenuOptions({ column2: '', column3: '', column1: option })
    if (column === 'column2' && column3 !== '')
      return setMenuOptions({ ...menuOptions, column2: option, column3: '' })
    setMenuOptions({ ...menuOptions, [column]: option })
  }

  const isSheepSelected = column1 === 'animals' && column2 === 'sheep'
  const farmIncludeTeam = farm?.haveATeam

  return (
    <div className="flex w-full  flex-wrap ">
      {/* ********************************* FARM MENU ************************************* */}
      <MenuSection className=" w-full sm:w-2/6 ">
        <>
          <div className="  p-1 flex justify-start w-min mx-auto  ">
            {/****************  column 1 *********************/}

            <div className="flex-col flex ">
              <SquareOption
                title="Animals"
                iconName="herd"
                onClick={() => handleChangeOption('column1', 'animals')}
                selected={menuOptions.column1 === 'animals'}
              />

              <SquareOption
                title="Eventos"
                iconName="event"
                onClick={() => handleChangeOption('column1', 'events')}
                selected={menuOptions.column1 === 'events'}
              />

              {farmIncludeTeam && (
                <SquareOption
                  title="Equipo"
                  iconName="team"
                  onClick={() => handleChangeOption('column1', 'team')}
                  selected={menuOptions.column1 === 'team'}
                />
              )}
            </div>

            {/****************  column 2 *********************/}

            <div className="flex flex-col ">
              {menuOptions?.column1 === 'animals' && (
                <SquareOption
                  title="Borregas"
                  iconName="sheep"
                  onClick={() => handleChangeOption('column2', 'sheep')}
                  selected={menuOptions.column2 === 'sheep'}
                />
              )}
              {menuOptions?.column1 === 'events' && (
                <>
                  <SquareOption
                    title="Todos"
                    iconName="list"
                    onClick={() => handleChangeOption('column2', 'list')}
                    selected={menuOptions.column2 === 'list'}
                  />
                  <SquareOption
                    title="Montas"
                    iconName="cart"
                    onClick={() =>
                      handleChangeOption('column2', 'breedingEvent')
                    }
                    selected={menuOptions.column2 === 'breedingEvent'}
                  />
                </>
              )}
            </div>

            {/****************  column 3 *********************/}
            <div className="flex flex-col">
              {column1 === 'events' && column2 === 'breedingEvent' && (
                <>
                  <SquareOption
                    title="Monta"
                    iconName="plus"
                    onClick={() => handleChangeOption('column3', 'add')}
                    selected={column3 === 'add'}
                  />
                </>
              )}
            </div>
            <div className="flex flex-col">
              {column2 === 'sheep' && (
                <>
                  <SquareOption
                    title="Todos"
                    iconName="list"
                    onClick={() => handleChangeOption('column3', 'list')}
                    selected={column3 === 'list'}
                  />
                  <SquareOption
                    title="Nuevo"
                    iconName="plus"
                    onClick={() => handleChangeOption('column3', 'add')}
                    selected={column3 === 'add'}
                  />
                  <SquareOption
                    title="Varios"
                    iconName="plus"
                    onClick={() => handleChangeOption('column3', 'addMany')}
                    selected={column3 === 'addMany'}
                  />
                  <SquareOption
                    title="Lote"
                    iconName="plus"
                    onClick={() => handleChangeOption('column3', 'addBatch')}
                    selected={column3 === 'addBatch'}
                  />
                </>
              )}
            </div>
          </div>
        </>
      </MenuSection>
      <MenuSection className=" w-full sm:w-4/6 ">
        <>
          {/* ********************************+ ANIMAL TABLE, ANIMAL FORM ANIMALS FORM*************************************** */}
          {column2 === 'breedingEvent' && column3 === 'add' && (
            <BreedingEvent />
          )}
          {isSheepSelected && column3 === 'list' && (
            <OvinesTable
            // onRowClick={(row) => setListOptionSelected(row?.id)}
            // selectedRow={listOptionSelected}
            />
          )}
          {isSheepSelected && column3 === 'add' && (
            <div className=" bg-base-300 shadow-md rounded-md p-2">
              <AnimalForm
                animal={{
                  type: 'ovine'
                }}
              />
            </div>
          )}
          {isSheepSelected && menuOptions.column3 === 'addMany' && (
            <div className=" bg-base-300 shadow-md rounded-md p-2">
              <AnimalsForm
                animal={{
                  type: 'ovine'
                }}
              />
            </div>
          )}
          {isSheepSelected && menuOptions.column3 === 'addBatch' && <Batch />}
          {menuOptions?.column1 === 'team' && (
            <>
              <div className=" bg-base-300 shadow-md rounded-md p-2  mt-1 max-w-sm">
                <FarmTeam />
              </div>
            </>
          )}
        </>
      </MenuSection>
    </div>
  )
}

const MenuSection = ({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div className={`min-h-16 min-w-[150px]   ${className ?? ''}`}>
      <div className="  w-full h-full flex justify-center">{children}</div>
    </div>
  )
}

export default FarmMenu
