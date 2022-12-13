export interface MenuOptionType {
  id: string
  label: string
  options?: MenuOptionType[]
}
const COMMON_OPS: MenuOptionType[] = [
  {
    id: 'add',
    label: 'Nuevo'
  },
  {
    id: 'find',
    label: 'Buscar'
  },
  {
    id: 'showAll',
    label: 'Todos'
  }
]

const ANIMALS: MenuOptionType = {
  id: 'animals',
  label: 'Animales',
  options: [
    {
      id: 'ovine',
      label: 'Borregos',
      options: COMMON_OPS
    }
    // {
    //   id: 'bovine',
    //   label: 'Vacas',
    //   options: COMMON_OPS
    // }
  ]
}

const EVENTS: MenuOptionType = {
  id: 'events',
  label: 'Events',
  options: [
    {
      id: 'calendar',
      label: 'Calendario'
    },
    {
      id: 'animals',
      label: 'Animales',
      options: [
        {
          id: 'sheep',
          label: 'Borregos'
        },
        {
          id: 'cows',
          label: 'Vacas'
        }
      ]
    }
  ]
}

const TEAM = {
  id: 'team',
  label: 'Equipo',
  options: [
    {
      id: 'members',
      label: 'Miembros',
      options: COMMON_OPS
    }
  ]
}
const AnimalOptions = {
  options: [ANIMALS, EVENTS, TEAM]
}

export default AnimalOptions
