// import { CreateEventDTO } from '@firebase/Events/event.model'
import {
  createEvent,
  deleteEvent,
  getFarmEvents
} from '../../firebase/Events/main'
import { assert, describe, it, expect } from 'vitest'
import { CreateEventDTO } from '@firebase/Events/event.model'
const basicEvent: CreateEventDTO = {
  batch: 'test',
  breedingBatch: [],
  breedingMale: { earring: 'test-1' },
  farm: {
    id: 'test',
    name: 'test'
  },
  finishAt: new Date(),
  startAt: new Date(),
  type: 'BREEDING',
  // @ts-ignore
  userId: 'test'
}
describe.skip('create a breeding event with all dependencies', () => {
  it('should create a normal event ', async () => {
    try {
      const res = await createEvent(basicEvent)
      expect(res).toBeDefined()
      return console.log(res)
    } catch (err) {
      expect(err).toBeUndefined()
      return console.error(err)
    }
  })
  it('should find and delete a normal event ', async () => {
    try {
      const bring = await getFarmEvents('test')
      console.log({ bring })
      expect(bring).toBeDefined()
      const promises = bring.map((event) => deleteEvent(event.id))
      expect(promises).toBeDefined()
      await Promise.all(promises).then((res) => {
        console.log(res)
        expect(res).toBeDefined()
      })
    } catch (err) {
      expect(err).toBeUndefined()
      return console.error(err)
    }
  })
})
