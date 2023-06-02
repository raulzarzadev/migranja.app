import BirthEvents from '@comps/BirthEvents'
import FarmNumbers from '@comps/FarmNumbers_v2'
import AnimalForm from '@comps/forms/AnimalForm'
import PrintableSellForm from '@comps/forms/SellForm/PrintableSellForm'
import InventoryForm from '@comps/InventoryForm'
import InventoryHistory from '@comps/InventoryHistory'
import SalesList from '@comps/Sales/SalesList'
import WeaningEvents from '@comps/WeaningEvents'
import BreedingsList from 'components/BreedingsList'
import FarmEvents from 'components/FarmEvents'
import FarmTeam from 'components/FarmTeam'
//import AnimalsForm from '@comps/forms/AnimalsForm_old'
import BreedingForm from 'components/forms/BreedingForm'
import OvinesTable from 'components/OvinesTable'
import SquareOption from 'components/SquareOption'
import React, { ReactNode, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmState } from 'store/slices/farmSlice'
import AddBatch from '@comps/AddBatch'
import BirthForm from '@comps/BreedingsList/AnimalBreedingOptions/BirthForm'
import AnimalsForm from '@comps/AnimalsForm'
import HealthReport from '@comps/HealtView/HealthReport'
import Vaccines from '@comps/HealtView/Vaccines'
import { IconName } from '@comps/Icon/icons-list'
import { getProperty, setProperty } from 'dot-prop'
import SquareOption2 from '@comps/SquareOption2'
import { EventsList } from '@comps/FarmEvents/EventsList'

type MenuItem = {
  label: string
  icon: IconName
  showChildren: boolean
  component?:
    | JSX.Element
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  children?: Record<string, MenuItem>
}

type MenuOptions = Record<string, MenuItem>

const menuOptions2: MenuOptions = {
  numbers: {
    label: 'Numeros',
    icon: 'chart',
    showChildren: false,
    component: <FarmNumbers />
  },
  sheep: {
    label: 'Ovejas',
    icon: 'sheep',
    showChildren: false,
    component: <OvinesTable />,
    children: {
      newSheep: {
        label: 'Nueva',
        icon: 'plus',
        showChildren: false,
        component: <AnimalForm />
      },
      newBatch: {
        label: 'Varios',
        icon: 'plus',
        showChildren: false,
        component: <AnimalsForm />
      },
      inventory: {
        label: 'Inventarios',
        icon: 'book',
        showChildren: false,
        component: <InventoryHistory />,
        children: {
          newInventory: {
            label: 'Nuevo',
            icon: 'plus',
            showChildren: false,
            component: <InventoryForm />
          }
        }
      }
    }
  },
  events: {
    label: 'Eventos',
    icon: 'event',
    showChildren: false,
    component: <FarmEvents />,
    children: {
      breedingEvent: {
        label: 'Montas',
        icon: 'cart',
        showChildren: false,
        component: (
          <>
            <BreedingsList />
          </>
        ),
        children: {
          newBreeding: {
            label: 'Nueva',
            icon: 'plus',
            showChildren: false,
            component: (
              <>
                <BreedingForm />
              </>
            )
          }
        }
      },
      birthEvents: {
        label: 'Partos',
        icon: 'birth',
        showChildren: false,
        component: (
          <>
            <BirthEvents />
          </>
        ),
        children: {
          newBirth: {
            label: 'Nuevo',
            icon: 'plus',
            showChildren: false,
            component: (
              <>
                <BirthForm />
              </>
            )
          }
        }
      },
      weaningEvents: {
        label: 'Destetes',
        icon: 'noFood',
        showChildren: false,
        component: <WeaningEvents />
      },
      sales: {
        label: 'Ventas',
        icon: 'dollar',
        showChildren: false,
        component: (
          <>
            <SalesList />
          </>
        ),
        children: {
          newSell: {
            label: 'Venta',
            icon: 'plus',
            showChildren: false,
            component: <PrintableSellForm />
          }
        }
      }
    }
  },
  team: {
    label: 'Equipo',
    icon: 'team',
    showChildren: false,
    component: <FarmTeam />
  },
  sanity: {
    label: 'Sanidad',
    icon: 'health',
    showChildren: false,
    component: <HealthReport />,
    children: {
      vaccine: {
        label: 'Vacunas',
        icon: 'vaccine',
        showChildren: false,
        component: <Vaccines />
      }
    }
  }
}

const FarmMenu = (props: any) => {
  const [menu, setMenu] = useState(menuOptions2)
  const [selectedItem, setSelectedItem] = useState('')

  const handleClick = (key: string) => {
    console.log({ key })
    setSelectedItem(selectedItem === key ? '' : key)
    const newMenu = setProperty(
      menu,
      `${key}.showChildren`,
      !(selectedItem === key)
    )
    selectedItem === key && setProperty(menu, `${key}.showChildren`, false)
    setMenu(newMenu)
  }

  const renderMenu = (menuItems: MenuOptions, parent = '') => {
    return (
      <menu className={`grid w-min place-items-end gap-2 place-content-start`}>
        {Object.keys(menuItems).map((key) => {
          const menuItem = menuItems[key]
          const menuKey = `${parent && parent + '.children.'}${key}`

          return (
            <>
              <SquareOption2
                iconName={menuItem.icon}
                title={menuItem.label}
                onClick={() => handleClick(menuKey)}
                selected={
                  menuKey === selectedItem || selectedItem.includes(menuKey)
                }
              />

              {menuItem.showChildren && menuItem.children && (
                <div className=" ml-4 ">
                  {renderMenu(menuItem.children, menuKey)}
                </div>
              )}
            </>
          )
        })}
      </menu>
    )
  }

  return (
    <section className="flex w-full ">
      {renderMenu(menu)}
      {getProperty(menu, selectedItem)?.component && (
        <section className="bg-base-300 rounded-lg shadow-md ml-2 overflow-x-auto  w-full ">
          <h2 className="text-center">
            {getProperty(menu, selectedItem)?.label}
          </h2>
          <section className="p-2 ">
            {getProperty(menu, selectedItem)?.component}
          </section>
        </section>
      )}
    </section>
  )
}

export default FarmMenu
