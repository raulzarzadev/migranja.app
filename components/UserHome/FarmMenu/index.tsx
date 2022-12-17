import { FarmType } from '@firebase/Farm/farm.model'
import AnimalsTable from 'components/AnimalsTable'
import AnimalForm from 'components/forms/AnimalForm'
import FarmTeamForm from 'components/forms/FarmTeamForm.tsx'
import SquareOption from 'components/SquareOption'
import { useState } from 'react'
import AnimalCard from '../../AnimalCard'
type MenuOptions = 'column1' | 'column2' | 'column3'
type Option = 'animals' | 'sheep' | 'add' | 'list' | 'events' | 'team'

const FarmMenu = ({ farm }: { farm: FarmType | null }) => {
  const [menuOptions, setMenuOptions] = useState<
    Partial<Record<MenuOptions, Option>>
  >({})

  const handleChangeOption = (column: MenuOptions, option: Option) => {
    if (column === 'column1') return setMenuOptions({ [column]: option })
    setMenuOptions({ ...menuOptions, [column]: option })
  }
  const [listOptionSelected, setListOptionSelected] = useState('')
  const isSheepSelected =
    menuOptions.column1 === 'animals' && menuOptions.column2 === 'sheep'
  const farmIncludeTeam = farm?.haveATeam

  return (
    <div className="flex gap-2 flex-col sm:flex-row">
      {/****************  Farm *********************/}
      {/****************  menu columns *********************/}
      <div className="flex">
        {/****************  column 1 *********************/}
        <div className="flex-col flex">
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
                title="Nuevo"
                iconName="plus"
                onClick={() => handleChangeOption('column3', 'add')}
                selected={menuOptions.column3 === 'add'}
              />
              <SquareOption
                title="Todos"
                iconName="list"
                onClick={() => handleChangeOption('column3', 'list')}
                selected={menuOptions.column3 === 'list'}
              />
            </>
          )}
        </div>
      </div>

      {/****************  MORE INFORMATION AREA  *********************/}

      <div className=" flex w-full gap-2 mt-1 flex-col md:flex-row">
        {/* ********************************+ FARM MEMBER FORM *************************************** */}
        {menuOptions?.column1 === 'team' && (
          <>
            <div className="  bg-base-300 shadow-md rounded-md p-2  mt-1 max-w-sm">
              <FarmTeamForm />
            </div>
          </>
        )}
        {/* ********************************+ SHEEP FORM *************************************** */}

        {isSheepSelected && menuOptions.column3 === 'add' && (
          <div className="md:w-1/2  bg-base-300 shadow-md rounded-md p-2">
            <AnimalForm
              animal={{
                type: 'ovine'
              }}
            />
          </div>
        )}

        {isSheepSelected && menuOptions.column3 === 'list' && (
          <div className="md:w-1/2  bg-base-300 shadow-md rounded-md">
            <AnimalsTable
              onRowClick={(id) => setListOptionSelected(id)}
              selectedRow={listOptionSelected}
            />
          </div>
        )}

        {isSheepSelected &&
          menuOptions.column3 === 'list' &&
          listOptionSelected && (
            <div className="md:w-1/2  bg-base-300 shadow-md rounded-md">
              <AnimalCard animalId={listOptionSelected} />{' '}
            </div>
          )}
      </div>
    </div>
  )
}

export default FarmMenu
