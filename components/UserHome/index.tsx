import { useState } from 'react'
import AnimalsTable from '../AnimalsTable'
import AnimalForm from '../forms/AnimalForm'
import SquareOption from '../SquareOption'
import AnimalCard from './AnimalCard'

type MenuOptions = 'column1' | 'column2' | 'column3'
type Option = 'animals' | 'sheep' | 'add' | 'list' | 'events' | 'team'

const UserHome = () => {
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
  return (
    <div className="flex gap-2 flex-col sm:flex-row">
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

          <SquareOption
            title="Equipo"
            iconName="team"
            onClick={() => handleChangeOption('column1', 'team')}
            selected={menuOptions.column1 === 'team'}
          />
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
          {menuOptions?.column1 === 'team' && (
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

      {/****************  information area  *********************/}
      <div className=" flex w-full gap-2 mt-1 flex-col md:flex-row">
        {isSheepSelected && menuOptions.column3 === 'add' && (
          <div className="md:w-1/2  bg-base-300 rounded-md p-2">
            <AnimalForm
              animal={{
                type: 'ovine'
              }}
            />
          </div>
        )}

        {isSheepSelected && menuOptions.column3 === 'list' && (
          <div className="md:w-1/2  bg-base-300 rounded-md">
            <AnimalsTable
              onRowClick={(id) => setListOptionSelected(id)}
              selectedRow={listOptionSelected}
            />
          </div>
        )}

        {isSheepSelected &&
          menuOptions.column3 === 'list' &&
          listOptionSelected && (
            <div className="md:w-1/2  bg-base-300 rounded-md">
              <AnimalCard animalId={listOptionSelected} />{' '}
            </div>
          )}
      </div>
    </div>
  )
}

export default UserHome

/**
 * 
 *  <div className="flex gap-2  flex-col md:flex-row ">

      <div className="flex md:flex-col gap-2 ">
        <SquareOption
          selected={breadcrumb.type === 'animals'}
          option={{ title: 'Animales', iconName: 'herd' }}
          onClick={() => handleClick('animals', 'type')}
        />
        <SquareOption
          selected={breadcrumb.type === 'events'}
          option={{ title: 'Eventos', iconName: 'calendar' }}
          onClick={() => handleClick('events', 'type')}
        />
        <SquareOption
          selected={breadcrumb.type === 'team'}
          option={{ title: 'Equipo', iconName: 'team' }}
          onClick={() => handleClick('team', 'type')}
        />
      </div>


      <div className="flex md:flex-col gap-2">
        {MENU?.find(({ id }) => id === breadcrumb?.type)?.options?.map(
          (option) => (
            <SquareOption
              key={option.id}
              selected={breadcrumb.animal === option?.id}
              option={{ title: option?.label, iconName: option?.iconName }}
              onClick={() => handleClick(option.id, 'animal')}
            />
          )
        )}
      </div>


      <div className="flex md:flex-col gap-2">
        {MENU.find(({ id }) => id === breadcrumb?.type)
          ?.options?.find(({ id }) => id === breadcrumb?.animal)
          ?.options?.map((option: any) => (
            <SquareOption
              key={option.id}
              selected={breadcrumb.animalOpt === option?.id}
              option={{ title: option?.label, iconName: option?.iconName }}
              onClick={() => handleClick(option.id, 'animalOpt')}
            />
          ))}
      </div>


      <div className={`bg-base-300 rounded-lg shadow-md  `}>
        {breadcrumb.animalOpt === 'add' && (
          <div className="p-2">
            <AnimalForm
              animal={{
                type: breadcrumb.animal as AnimalType['type']
              }}
            />
          </div>
        )}
      </div>


      <div className={`bg-base-300 rounded-lg shadow-md  `}>
        {breadcrumb.animalOpt === 'showAll' && (
          <AnimalsTable
            onRowClick={(id) => handleRowClick(id)}
            selectedRow={breadcrumb?.animalSelected}
          />
        )}
      </div>

      {breadcrumb?.animalSelected && (
        <div className="bg-base-300 w-full rounded-lg shadow-md flex justify-center items-center">
          <div className="">
            <AnimalCard animalId={breadcrumb?.animalSelected} />
          </div>
        </div>
      )}
    </div>
 * 
 */
