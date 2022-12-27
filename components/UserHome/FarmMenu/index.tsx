import { FarmType } from '@firebase/Farm/farm.model'
import BatchTable from 'components/BatchTable'
import FarmTeam from 'components/FarmTeam'
import AnimalForm from 'components/forms/AnimalForm'
import AnimalsForm from 'components/forms/AnimalsForm'
import BatchForm, { BatchType } from 'components/forms/BatchForm'
import OvinesTable from 'components/OvinesTable'
import SquareOption from 'components/SquareOption'
import { useState } from 'react'
import AnimalCard from '../../AnimalCard'
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
  console.count()
  const [menuOptions, setMenuOptions] = useState<
    Partial<Record<MenuOptions, Option>>
  >({})

  const handleChangeOption = (column: MenuOptions, option: Option) => {
    if (column === 'column1') return setMenuOptions({ [column]: option })
    setMenuOptions({ ...menuOptions, [column]: option })
  }
  const [listOptionSelected, setListOptionSelected] = useState<string | null>(
    ''
  )
  const isSheepSelected =
    menuOptions.column1 === 'animals' && menuOptions.column2 === 'sheep'
  const farmIncludeTeam = farm?.haveATeam

  const [batch, setBatch] = useState<BatchType | null>(null)
  return (
    <div className="flex flex-wrap ">
      {/* ********************************* FARM MENU ************************************* */}

      <div className="  p-1 flex justify-center w-min mx-auto  ">
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
      {/* This will keep center the menu  */}
      <div className=" flex w-full sm:w-0" />

      {/* ********************************+ ANIMAL TABLE, ANIMAL FORM ANIMALS FORM*************************************** */}

      <div className=" p-1 flex justify-center flex-1 ">
        {isSheepSelected && menuOptions.column3 === 'list' && (
          <div className=" bg-base-300 shadow-md rounded-md">
            <OvinesTable
              onRowClick={({ id }) => setListOptionSelected(id)}
              selectedRow={listOptionSelected}
            />
          </div>
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
        {isSheepSelected && menuOptions.column3 === 'addBatch' && (
          <div className=" bg-base-300 shadow-md rounded-md p-2 w-full">
            <BatchForm
              animal={{
                type: 'ovine'
              }}
              setBatch={setBatch}
            />
          </div>
        )}
        {menuOptions?.column1 === 'team' && (
          <>
            <div className=" bg-base-300 shadow-md rounded-md p-2  mt-1 max-w-sm">
              <FarmTeam />
            </div>
          </>
        )}
      </div>

      {/* ********************************+ ANIMAL CARD AND FARM TEAM WHEN THIS OPS ARE SELECTED*************************************** */}

      <div className="  p-1 flex justify-center w-full md:w-1/3 ">
        {isSheepSelected &&
          menuOptions.column3 === 'addBatch' &&
          batch?.animals?.length && (
            <div className="  bg-base-300 shadow-md rounded-md w-full">
              <BatchTable animals={batch?.animals} />{' '}
            </div>
          )}
      </div>

      <div className="  p-1 flex justify-center w-full md:w-1/3 ">
        {isSheepSelected &&
          menuOptions.column3 === 'list' &&
          listOptionSelected && (
            <div className="  bg-base-300 shadow-md rounded-md">
              <AnimalCard animalId={listOptionSelected} />{' '}
            </div>
          )}
      </div>
    </div>
  )
}

export default FarmMenu
