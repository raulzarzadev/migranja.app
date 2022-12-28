import { FarmType } from '@firebase/Farm/farm.model'
import Batch from 'components/Batch'
import BatchTable from 'components/BatchTable'
import FarmTeam from 'components/FarmTeam'
import AnimalForm from 'components/forms/AnimalForm'
import AnimalsForm from 'components/forms/AnimalsForm'
import BatchForm, { BatchType } from 'components/forms/BatchForm'
import OvinesTable from 'components/OvinesTable'
import SquareOption from 'components/SquareOption'
import { ReactNode, useState } from 'react'

type MenuOptions = 'column1' | 'column2' | 'column3'
type Option =
  | 'animals'
  | 'sheep'
  | 'add'
  | 'list'
  | 'events'
  | 'team'
  | 'addMany'
  | 'addBatch'

const FarmMenu = ({ farm }: { farm: FarmType | null }) => {
  const [menuOptions, setMenuOptions] = useState<
    Partial<Record<MenuOptions, Option>>
  >({})

  const handleChangeOption = (column: MenuOptions, option: Option) => {
    if (column === 'column1') return setMenuOptions({ [column]: option })
    setMenuOptions({ ...menuOptions, [column]: option })
  }

  const isSheepSelected =
    menuOptions.column1 === 'animals' && menuOptions.column2 === 'sheep'
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
                    title="Nuevo"
                    iconName="plus"
                    onClick={() => handleChangeOption('column2', 'add')}
                    selected={menuOptions.column2 === 'add'}
                  />
                  <SquareOption
                    title="Todos"
                    iconName="list"
                    onClick={() => handleChangeOption('column2', 'list')}
                    selected={menuOptions.column2 === 'list'}
                  />
                </>
              )}
            </div>

            {/****************  column 3 *********************/}

            <div className="flex flex-col">
              {menuOptions?.column2 === 'sheep' && (
                <>
                  <SquareOption
                    title="Todos"
                    iconName="list"
                    onClick={() => handleChangeOption('column3', 'list')}
                    selected={menuOptions.column3 === 'list'}
                  />
                  <SquareOption
                    title="Nuevo"
                    iconName="plus"
                    onClick={() => handleChangeOption('column3', 'add')}
                    selected={menuOptions.column3 === 'add'}
                  />
                  <SquareOption
                    title="Varios"
                    iconName="plus"
                    onClick={() => handleChangeOption('column3', 'addMany')}
                    selected={menuOptions.column3 === 'addMany'}
                  />
                  <SquareOption
                    title="Lote"
                    iconName="plus"
                    onClick={() => handleChangeOption('column3', 'addBatch')}
                    selected={menuOptions.column3 === 'addBatch'}
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
          {isSheepSelected && menuOptions.column3 === 'list' && (
            <OvinesTable
            // onRowClick={(row) => setListOptionSelected(row?.id)}
            // selectedRow={listOptionSelected}
            />
          )}
          {isSheepSelected && menuOptions.column3 === 'add' && (
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
