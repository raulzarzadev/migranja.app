import { IconName } from 'components/Icon/icons-list'
interface OptionDef {
  id: string
  label: string
  iconName: IconName
}

export interface MenuOptionType extends OptionDef {
  options?: MenuOptionType[]
}
export const OPTIONS_DICTIONARY: Record<string, MenuOptionType> = {
  event: {
    id: 'event',
    label: 'Eventos',
    iconName: 'event'
  },
  team: {
    id: 'team',
    label: 'Equipo',
    iconName: 'team'
  },
  ovine: {
    id: 'ovine',
    label: 'Borregos',
    iconName: 'sheep'
  },
  add: {
    id: 'add',
    label: 'Nuevo',
    iconName: 'plus'
  },
  showAll: {
    id: 'showAll',
    label: 'Todos',
    iconName: 'list'
  },
  calendar: {
    id: 'calendar',
    label: 'Calendario',
    iconName: 'calendar'
  },
  animals: {
    id: 'animals',
    label: 'Animales',
    iconName: 'herd'
  }
} as const

export const ANIMALS: MenuOptionType = {
  ...OPTIONS_DICTIONARY.animals,
  options: [
    {
      ...OPTIONS_DICTIONARY.ovine,
      options: [OPTIONS_DICTIONARY.add, OPTIONS_DICTIONARY.showAll]
    }
  ]
}

export const EVENTS: MenuOptionType = {
  ...OPTIONS_DICTIONARY.event,
  options: [OPTIONS_DICTIONARY.add, OPTIONS_DICTIONARY.showAll]
}

export const TEAM: MenuOptionType = {
  ...OPTIONS_DICTIONARY.team,
  options: [OPTIONS_DICTIONARY.add, OPTIONS_DICTIONARY.showAll]
}

const MENU: MenuOptionType[] = [ANIMALS, EVENTS, TEAM]

export default MENU
