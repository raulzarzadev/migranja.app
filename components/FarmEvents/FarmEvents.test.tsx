import { render, screen } from '@testing-library/react'
import { FarmStateAnimalEvent } from 'store/slices/farmSlice'
import FarmEvents from '.'
import EventModal from './EventModal'
import FarmEvent from './FarmEvent/FarmEvent'

const numberDate = new Date().getTime()
export const FARM_EVENT: FarmStateAnimalEvent = {
  id: '1',
  type: 'BIRTH',
  // birthData: {
  //   birthType: 3,
  //   calfs: [
  //     {
  //       earring: '109',
  //       birthday: numberDate,
  //       id: '34fsdf',
  //       batch: '999',
  //       gender: 'male',
  //       userId: 'asdawwer',
  //       updatedAt: numberDate,
  //       birthType: 3,
  //       breed: 'dorper',
  //       createdAt: numberDate,
  //       images: [],
  //       joinedAt: numberDate,
  //       name: 'PEPA',
  //       type: 'ovine'
  //     }
  //   ],
  //   date: numberDate
  // },
  parents: {
    father: {
      inTheFarm: true,
      earring: '109',
      name: 'my test',
      breed: 'katahdin',
      id: '2',
      gender: 'male',
      birthday: numberDate
    },
    mother: {
      inTheFarm: true,
      earring: '419-F',
      name: '',
      breed: 'katahdin',
      id: '5',
      gender: 'female',
      birthday: numberDate
    }
  },
  updatedAt: 0,
  createdAt: 0,
  farm: {
    id: '',
    name: ''
  },
  isDuplicated: undefined,
  name: undefined,
  birthday: undefined,
  earring: undefined,
  images: undefined,
  gender: undefined,
  breed: undefined,
  status: undefined,
  weight: undefined,
  batch: undefined,
  birthType: undefined,
  joinedAt: undefined,
  batchData: undefined,
  breeding: undefined,
  statuses: undefined,
  currentStatus: undefined,
  userId: '',
  eventData: {
    status: 'CANCELLED',
    earring: '',
    animals: [],
    batchId: '',
    breedingBatch: [],
    breedingId: '',
    breedingMale: {
      inTheFarm: true
    },
    id: '',
    finishAt: '',
    parents: {},
    startAt: '',
    birthType: 1,
    date: ''
  },
  birthEventData: undefined,
  isStallion: undefined,
  state: undefined,
  pastState: undefined
}
describe('Farm Events List', () => {
  it('Farm Events List', () => {
    const component = render(<FarmEvents />)
    component.getByRole('events-list')
    // screen.debug()
  })

  it('Farm event ', () => {
    const component = render(<FarmEvent event={FARM_EVENT} />)
    const farmEvent = component.getByRole('farm-event')
    expect(farmEvent).toHaveTextContent('Genetica')
  })

  it('Farm Details Modal', () => {
    const component = render(<EventModal event={FARM_EVENT} />)
    component.getByText('Detalles del Evento')
  })
})
