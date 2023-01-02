import { render, screen } from '@testing-library/react'
import FarmEvents from '.'
import EventModal from './EventModal'
import FarmEvent, { FarmEventType } from './FarmEvent'

const numberDate = new Date().getTime()
export const FARM_EVENT: FarmEventType = {
  id: '1',
  type: 'BIRTH',
  birthData: {
    birthType: 3,
    calfs: [
      {
        earring: '109',
        birthday: numberDate,
        id: '34fsdf',
        batch: '999',
        gender: 'male',
        userId: 'asdawwer',
        updatedAt: numberDate,
        birthType: 3,
        breed: 'dorper',
        createdAt: numberDate,
        images: [],
        joinedAt: numberDate,
        name: 'PEPA',
        type: 'ovine'
      }
    ],
    date: numberDate
  },
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
  createdAt: 0
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
