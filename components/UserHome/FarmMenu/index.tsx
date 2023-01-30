import BirthEvents from '@comps/BirthEvents'
import FarmNumbers from '@comps/FarmNumbers'
import AnimalForm from '@comps/forms/AnimalForm'
import PrintableSellForm from '@comps/forms/SellForm/PrintableSellForm'
import InventoryForm from '@comps/InventoryForm'
import InventoryHistory from '@comps/InventoryHistory'
import SalesList from '@comps/Sales/SalesList'
import WeaningEvents from '@comps/WeaningEvents'
import Batch from 'components/Batch'
import BreedingsList from 'components/BreedingsList'
import FarmEvents from 'components/FarmEvents'
import FarmTeam from 'components/FarmTeam'
import AnimalsForm from 'components/forms/AnimalsForm'
import BreedingForm from 'components/forms/BreedingForm'
import OvinesTable from 'components/OvinesTable'
import SquareOption from 'components/SquareOption'
import { ReactNode, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmState } from 'store/slices/farmSlice'

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
  | 'birthEvents'
  | 'weaningEvents'
  | 'numbers'
  | 'sell'
  | 'sales'
  | 'inventory'

const FarmMenu = (props: any) => {
  const farm = useSelector(selectFarmState)
  // useDebugInformation('FarmPage', {})
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

  if (!farm)
    return (
      <div className="text-center ">
        No tienes acceso a esta granja o ha sido eliminada
      </div>
    )
  if (!menuOptions) return <></>
  const { column1, column2, column3 } = menuOptions
  // console.log({ column1, column2, column3 })

  const handleChangeOption = (column: MenuOptions, option: Option) => {
    if (column === 'column1')
      return setMenuOptions({ column2: '', column3: '', column1: option })
    if (column === 'column2' && column3 !== '')
      return setMenuOptions({ ...menuOptions, column2: option, column3: '' })
    setMenuOptions({ ...menuOptions, [column]: option })
  }

  const isAddSelected = [column1, column2, column3].includes('add')
  const isSheepSelected = column1 === 'sheep'
  const farmIncludeTeam = farm?.haveATeam
  const isEventsSelected = menuOptions?.column1 === 'events'
  const sheepInventory =
    isSheepSelected && column2 === 'inventory' && !isAddSelected
  const newSheepInventory =
    isSheepSelected && column2 === 'inventory' && isAddSelected
  return (
    <div className=" sm:flex">
      {/* ********************************* FARM MENU ************************************* */}

      <MenuSection className="  sm:w-[320px]  ">
        <>
          <div className="  p-1 flex justify-start w-min mx-auto  ">
            {/****************  column 1 *********************/}

            <div className="flex-col flex ">
              <SquareOption
                title="Numeros"
                iconName="chart"
                onClick={() => handleChangeOption('column1', 'numbers')}
                selected={menuOptions.column1 === 'numbers'}
              />

              <SquareOption
                title="Borregas"
                iconName="sheep"
                onClick={() => handleChangeOption('column1', 'sheep')}
                selected={menuOptions.column1 === 'sheep'}
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
              {/* ************************************* *********** EVENTS MENU */}

              {isEventsSelected && (
                <>
                  <SquareOption
                    title="Montas"
                    iconName="cart"
                    onClick={() =>
                      handleChangeOption('column2', 'breedingEvent')
                    }
                    selected={menuOptions.column2 === 'breedingEvent'}
                  />
                  <SquareOption
                    title="Partos"
                    iconName="birth"
                    onClick={() => handleChangeOption('column2', 'birthEvents')}
                    selected={menuOptions.column2 === 'birthEvents'}
                  />
                  <SquareOption
                    title="Destetes"
                    iconName="noFood"
                    onClick={() =>
                      handleChangeOption('column2', 'weaningEvents')
                    }
                    selected={menuOptions.column2 === 'weaningEvents'}
                  />
                  <SquareOption
                    title="Ventas"
                    iconName="dollar"
                    onClick={() => handleChangeOption('column2', 'sales')}
                    selected={menuOptions.column2 === 'sales'}
                  />
                </>
              )}
            </div>

            {/****************  column 3 *********************/}
            <div className="flex flex-col">
              {/* ************************************* *********** BREEDINGS MENU */}

              {column1 === 'events' &&
                ['breedingEvent', 'sales'].includes(column2 || '') && (
                  <>
                    {/* <SquareOption
                    title="Montas"
                    iconName="list"
                    onClick={() => handleChangeOption('column3', 'list')}
                    selected={column3 === 'list'}
                  /> */}
                    <SquareOption
                      title="Nueva"
                      iconName="plus"
                      onClick={() => handleChangeOption('column3', 'add')}
                      selected={column3 === 'add'}
                    />
                  </>
                )}
            </div>
            <div className="flex flex-col">
              {/* ************************************* *********** SHEEP MENU */}
              {isSheepSelected && (
                <>
                  <SquareOption
                    title="Nuevo"
                    iconName="plus"
                    onClick={() => handleChangeOption('column2', 'add')}
                    selected={column2 !== 'inventory' && column3 === 'add'}
                  />
                  <SquareOption
                    title="Varios"
                    iconName="plus"
                    onClick={() => handleChangeOption('column2', 'addMany')}
                    selected={column3 === 'addMany'}
                  />
                  <SquareOption
                    title="Lote"
                    iconName="plus"
                    onClick={() => handleChangeOption('column2', 'addBatch')}
                    selected={column3 === 'addBatch'}
                  />
                  {/* ************************************* *********** INVENTORY MENU */}

                  <SquareOption
                    title="Inventarios"
                    iconName="list"
                    onClick={() => handleChangeOption('column2', 'inventory')}
                    selected={column2 === 'inventory'}
                  />
                </>
              )}
            </div>
            <div className="flex flex-col">
              {isSheepSelected && column2 === 'inventory' && (
                <SquareOption
                  title="Nuevo"
                  iconName="plus"
                  onClick={() => handleChangeOption('column3', 'add')}
                  selected={column3 === 'add'}
                />
              )}
            </div>
          </div>
        </>
      </MenuSection>

      <MenuSection className="w-full   ">
        <>
          {' '}
          {/* ********************************+ NUMBERS AND CHARTS *************************************** */}
          {column1 === 'numbers' && !column2 && <FarmNumbers />}
          {/* ********************************+ ANIMAL TABLE, ANIMAL FORM ANIMALS FORM*************************************** */}
          {column1 === 'events' && !column2 && <FarmEvents />}
          {/* ********************************+ FARM EVENTS *************************************** */}
          {/* ********************************+ BREEDINGS *************************************** */}
          {column2 === 'breedingEvent' && !column3 && <BreedingsList />}
          {column2 === 'breedingEvent' && column3 === 'add' && <BreedingForm />}
          {/* ********************************+ BIRTH EVENTS *************************************** */}
          {column2 === 'birthEvents' && !column3 && <BirthEvents />}
          {/* ********************************+ WEANING EVENTS *************************************** */}
          {column2 === 'weaningEvents' && !column3 && <WeaningEvents />}
          {/* ********************************+ SELL ANIMALS EVENTS *************************************** */}
          {column2 === 'sales' && !column3 && (
            <div className=" bg-base-300 shadow-md rounded-md p-2">
              {/* <PrintComponent /> */}
              <SalesList />
              {/* */}
            </div>
          )}
          {column2 === 'sales' && column3 === 'add' && (
            <div className=" ">
              <PrintableSellForm />
            </div>
          )}
          {/* ********************************+******+ +++************** ANIMALS LIST */}
          {isSheepSelected && !column2 && <OvinesTable />}
          {/* ********************************+******+ +++************** ADD ONE ANIMAL */}
          {isSheepSelected && column2 === 'add' && <AnimalForm />}
          {/* ********************************+******+ +++************** ADD ANIMALS */}
          {isSheepSelected && menuOptions.column2 === 'addMany' && (
            <div className=" bg-base-300 shadow-md rounded-md p-2">
              <AnimalsForm
                animal={{
                  type: 'ovine'
                }}
              />
            </div>
          )}
          {/* ********************************+******+ +++************** ADD A BATCH OF ANIMALS */}
          {isSheepSelected && menuOptions.column2 === 'addBatch' && <Batch />}
          {newSheepInventory && <InventoryForm />}
          {sheepInventory && <InventoryHistory />}
          {/* ********************************+******+ +++************** ADMIN FARM TEAM*/}
          {menuOptions?.column1 === 'team' && (
            <>
              <div className=" bg-base-300 shadow-md rounded-md p-2  mt-1 w-full ">
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
      <div className="  w-full h-full flex justify-center ">{children}</div>
    </div>
  )
}

export default FarmMenu
