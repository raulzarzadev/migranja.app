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
import BreedingForm from 'components/forms/BreedingForm'
import OvinesTable from 'components/OvinesTable'
import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import BirthForm from '@comps/BreedingsList/AnimalBreedingOptions/BirthForm'
import AnimalsForm from '@comps/AnimalsForm'
import HealthReport from '@comps/HealtView/HealthReport'
import Vaccines from '@comps/HealtView/Vaccines'
import { IconName } from '@comps/Icon/icons-list'
import { getProperty, setProperty } from 'dot-prop'
import SquareOption2 from '@comps/SquareOption2'
import { Breadcrumbs, Button, Drawer, Fab } from '@mui/material'
import useModal from '@comps/hooks/useModal'
import Icon from '@comps/Icon'
import useMaterialMediaQuery from '@comps/hooks/useMaterialMediaQuery'
import useCurrentFarm from '@comps/hooks/useCurrentFarm'
import { selectAuthState } from 'store/slices/authSlice'
import AddMany from '@comps/AddMany'

type MenuItem = {
  label: string
  icon: IconName
  showChildren: boolean
  component?:
    | JSX.Element
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  children?: Record<string, MenuItem>
}

const FarmMenu = (props: any) => {
  const user = useSelector(selectAuthState)
  type MenuOptions = Record<string, MenuItem>
  const farmState = useCurrentFarm()
  const menuOptions: MenuOptions = {
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
          component: <AddMany />
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
                  <BirthForm title="Nuevo parto" />
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
  const hideOptionsDependsUserAndFarm = (options: MenuOptions): MenuOptions => {
    //if (user?.isAdmin) return options
    // if (user?.isDev) return options
    const aux = { ...options }
    if (!farmState?.healthRecordActive) delete aux.sanity
    if (!farmState?.haveATeam) delete aux.team
    return aux
  }

  const [menu, setMenu] = useState(hideOptionsDependsUserAndFarm(menuOptions))
  const [selectedItem, setSelectedItem] = useState('')

  const handleClick = (key: string) => {
    setSelectedItem(selectedItem === key ? '' : key)

    const root = key.split('.')[0]
    if (selectedItem !== '' && !selectedItem.includes(root)) {
      const openMenu = setProperty(
        { ...menuOptions },
        `${key}.showChildren`,
        true
      )
      setMenu(openMenu)
    } else {
      const newMenu = setProperty(
        menu,
        `${key}.showChildren`,
        !(selectedItem === key)
      )
      selectedItem === key && setProperty(menu, `${key}.showChildren`, false)
      setMenu(newMenu)
    }
  }

  const renderMenu = (menuItems: MenuOptions, parent = '') => {
    return (
      <menu className={`grid w-min place-items-end gap-2 place-content-start `}>
        {Object.keys(menuItems).map((key, i) => {
          const menuItem = menuItems[key]
          const menuKey = `${parent && parent + '.children.'}${key}`

          return (
            <Fragment key={i}>
              <SquareOption2
                iconName={menuItem.icon}
                title={menuItem.label}
                onClick={() => handleClick(menuKey)}
                selected={
                  menuKey === selectedItem || selectedItem.includes(menuKey)
                }
              />

              {menuItem.showChildren && menuItem.children && (
                <div className=" ml-4 " id={`${menuKey}`}>
                  {renderMenu(menuItem.children, menuKey)}
                </div>
              )}
            </Fragment>
          )
        })}
      </menu>
    )
  }

  const modal = useModal()
  const { match } = useMaterialMediaQuery({ size: 'sm' })
  return (
    <section className="flex w-full ">
      {match ? (
        renderMenu(menu)
      ) : (
        <>
          <Fab
            onClick={modal.handleOpen}
            sx={{ position: 'fixed' }}
            className="fixed bottom-8 right-4  !bg-base-100"
          >
            <span className="">
              <Icon name="menu" />
            </span>
          </Fab>

          <Drawer anchor={'left'} open={modal.open} onClose={modal.handleOpen}>
            <div className="bg-base-100 h-full p-1 pt-4">
              {renderMenu(menu)}
            </div>
          </Drawer>
        </>
      )}
      {getProperty(menu, selectedItem)?.component && (
        <section className="bg-base-300 rounded-lg shadow-md sm:ml-2 overflow-x-auto  w-full p-2 ">
          <Breadcrumbs aria-label="breadcrumb">
            {selectedItem
              .replaceAll('children.', '')
              .split('.')
              .map((crumb) => (
                <button
                  key={crumb}
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedItem(`${selectedItem.split(crumb)[0]}${crumb}`)
                    console.log(`${selectedItem.split(crumb)[0]}${crumb}`)
                  }}
                >
                  {crumb}
                </button>
              ))}
          </Breadcrumbs>

          <section className=" ">
            {getProperty(menu, selectedItem)?.component}
          </section>
        </section>
      )}
    </section>
  )
}

export default FarmMenu
